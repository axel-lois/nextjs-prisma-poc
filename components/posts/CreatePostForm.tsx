"use client";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useCreatePost } from "@/hooks/useCreatePost";

export function CreatePostForm() {
  const {
    users,
    isLoadingUsers,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    handleBack,
    watch,
  } = useCreatePost();

  if (isLoadingUsers) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Post
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                {...register("title", { required: "Title is required" })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
              <TextField
                label="Content"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                {...register("body", { required: "Body is required" })}
                error={!!errors.body}
                helperText={errors.body?.message}
              />
              <FormControl fullWidth error={!!errors.userId}>
                <InputLabel>Author</InputLabel>
                <Select
                  label="Author"
                  value={watch("userId")}
                  {...register("userId", {
                    required: "Please select an author",
                  })}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} (@{user.username})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button onClick={handleBack} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
