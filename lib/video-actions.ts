const API_URL = "https://1ec9-179-89-247-68.ngrok-free.app/api/videos";

export const getVideos = async () => {
  const response = await fetch(API_URL, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar vídeos");
  }

  return response.json();
};
