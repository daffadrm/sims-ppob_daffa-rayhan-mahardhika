import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlternateEmail, Edit, Person } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import DefaultProfile from "@/assets/images/DefaultProfile.png";
import { logout } from "@/features/auth/authSlice";
import { clearProfileError } from "@/features/profile/profileSlice";
import {
  fetchProfile,
  postProfileImage,
  postUpdateProfile,
} from "@/features/profile/profileThunk";
import { showAlert } from "@/store/alertStore";
import { AppDispatch, persistor, RootState } from "@/store/store";

const profileSchema = z.object({
  first_name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  last_name: z.string().min(2, "Nama harus minimal 2 karakter"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState("");
  const toggleEdit = () => setIsEditing(!isEditing);

  const MAX_SIZE = 100 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png"];

  const {
    profiles,
    loading: profileLoading,
    error: profileError,
    loadingUpdate,
  } = useSelector((state: RootState) => state.profile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      email: "",
      last_name: "",
    },
  });
  useEffect(() => {
    if (profiles) {
      reset({
        first_name: profiles.first_name || "",
        last_name: profiles.last_name || "",
        email: profiles.email || "",
      });
    }
  }, [profiles, reset]);
  useEffect(() => {
    if (profiles && profiles.profile_image) {
      setAvatar(profiles.profile_image);
    } else {
      setAvatar(DefaultProfile);
    }
  }, [profiles]);

  useEffect(() => {
    if (profileError)
      dispatch(showAlert({ message: profileError, severity: "error" }));
  }, [dispatch, profileError]);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(clearProfileError());
  }, [dispatch]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await dispatch(
        postUpdateProfile({
          first_name: data?.first_name,
          last_name: data?.last_name,
        })
      );
      dispatch(
        showAlert({ message: response.payload.message, severity: "success" })
      );
    } catch (err: any) {
      console.log(err, "err");
      dispatch(showAlert({ message: err, severity: "error" }));
    } finally {
      setIsEditing(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      dispatch(
        showAlert({
          message: "Hanya file JPEG atau PNG yang diperbolehkan!",
          severity: "error",
        })
      );

      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      dispatch(
        showAlert({ message: "Ukuran file maksimal 100KB!", severity: "error" })
      );

      e.target.value = "";
      return;
    }

    await dispatch(postProfileImage(file));
  };

  const handleLogout = async () => {
    dispatch(logout());
    localStorage.removeItem("persist:auth");
    await persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      {profileLoading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box sx={{ position: "relative" }}>
              <img
                src={avatar || DefaultProfile}
                alt="avatar"
                className="w-30 h-30 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = DefaultProfile;
                }}
              />

              <input
                accept="image/png, image/jpeg"
                id="avatar-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="avatar-upload">
                <Button
                  component="span"
                  variant="contained"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderRadius: "50%",
                    minWidth: 0,
                    padding: "6px",
                    cursor: "pointer",
                    backgroundColor: "white",
                  }}
                >
                  <Edit color="action" fontSize="small" />
                </Button>
              </label>
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
              {profiles?.first_name + " " + profiles?.last_name}
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 4 }}
            noValidate
          >
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, color: "text.secondary" }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box display="flex" flexDirection="column">
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, color: "text.secondary" }}
                >
                  Nama Depan
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled={!isEditing}
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box display="flex" flexDirection="column">
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, color: "text.secondary" }}
                >
                  Nama Belakang
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled={!isEditing}
                  {...register("last_name")}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" mt={4} gap={2}>
              {isEditing && (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loadingUpdate}
                  startIcon={
                    loadingUpdate ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                  sx={{ textTransform: "none" }}
                >
                  Simpan
                </Button>
              )}
            </Box>
          </Box>
          {!isEditing && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={toggleEdit}
                sx={{ textTransform: "none" }}
              >
                Edit Profil
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleLogout}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
