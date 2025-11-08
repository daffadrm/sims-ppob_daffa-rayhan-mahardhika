import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Visibility,
  VisibilityOff,
  Lock,
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
import { loginThunk } from "@/features/auth/authThunk";
import { useAppDispatch } from "@/store/hooks";
import { loginSchema } from "@/utils/auth/validations";

import { showAlert } from "../../store/alertStore";

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await dispatch(loginThunk(data)).unwrap();
      dispatch(showAlert({ message: response?.message, severity: "success" }));
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
            <div className="flex items-center space-x-2 mb-4">
              <img src={LogoImage} alt="Logo" className="w-8 h-8" />
              <span className="text-lg font-semibold text-black">
                SIMS PPOB
              </span>
            </div>
            <Typography mb={3} fontWeight={600}>
              Masuk atau buat akun untuk memulai
            </Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              margin="normal"
              size="small"
              placeholder="Username"
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, textTransform: "none" }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Masuk"}
            </Button>
            <div className="mt-2 text-sm">
              Belum punya akun? registrasi
              <Link to="/register" className="text-red-500 ml-1 cursor-pointer">
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
