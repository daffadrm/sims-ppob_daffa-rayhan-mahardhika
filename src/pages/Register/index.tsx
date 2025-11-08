/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  AlternateEmail,
} from "@mui/icons-material";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import BackgroundAuthImage from "@/assets/images/BackgroundAuth.png";
import LogoImage from "@/assets/images/Logo.png";
import { registerThunk } from "@/features/auth/authThunk";
import { useAppDispatch } from "@/store/hooks";
import { registerSchema } from "@/utils/auth/validations";

import { showAlert } from "../../store/alertStore";

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    const { confirmPassword, ...payload } = data;

    try {
      const response = await dispatch(
        registerThunk({ payload: payload })
      ).unwrap();
      dispatch(showAlert({ message: response.message, severity: "success" }));
      navigate("/");
    } catch (err: any) {
      console.log(err, "err");
      dispatch(showAlert({ message: err, severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ p: 6, width: "100%", maxWidth: "500px" }}>
          <div className="flex flex-col justify-center items-center">
            <div className="flex items-center space-x-2 mb-7">
              <img src={LogoImage} alt="Logo" className="w-8 h-8" />
              <span className="text-2xl font-semibold text-black">
                SIMS PPOB
              </span>
            </div>
            <Typography mb={3} fontWeight={600} fontSize={16}>
              Lengkapi data untuk membuat akun
            </Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              size="small"
              placeholder="Masukkan email anda"
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

            <TextField
              fullWidth
              margin="normal"
              size="small"
              placeholder="Nama depan"
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
            <TextField
              fullWidth
              margin="normal"
              size="small"
              placeholder="Nama belakang"
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
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              size="small"
              placeholder="Password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              type={showConfirm ? "text" : "password"}
              fullWidth
              margin="normal"
              size="small"
              placeholder="Konfirmasi Password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, fontSize: 12, textTransform: "none" }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Registrasi"}
            </Button>
            <div className="mt-2 text-sm text-center">
              Sudah punya akun? login
              <Link to="/login" className="text-red-500 ml-1 cursor-pointer">
                disini
              </Link>{" "}
            </div>
          </form>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${BackgroundAuthImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", md: "block" },
        }}
      />
    </Box>
  );
}
