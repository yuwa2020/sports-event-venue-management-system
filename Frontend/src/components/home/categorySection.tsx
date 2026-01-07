import { Box, Typography, Avatar, Grid } from "@mui/material";

// Sample categories
const categories = [
  { name: "Sports & Fitness", image: "/sports.jpg" },
  { name: "Music & Concerts", image: "/music.jpg" },
  { name: "Business & Networking", image: "/business.jpg" },
];

export default function CategorySection() {
  return (
    <Box sx={{ textAlign: "left", py: 4 }}>
      <Typography variant="h4" fontWeight="bold">Explore Categories</Typography>

      {/* Category List */}
      <Grid container spacing={3} justifyContent="left" sx={{ mt: 3 }}>
        {categories.map((category, index) => (
          <Grid item key={index}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar src={category.image} sx={{ width: 80, height: 80, mx: "auto", mb: 1 }} />
              <Typography variant="h6">{category.name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
