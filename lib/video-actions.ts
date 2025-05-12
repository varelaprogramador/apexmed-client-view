const API_URL = "https://dashboard.apexmed.matratecnologia.com/api/videos";

export const getVideos = async () => {
  const response = await fetch(API_URL, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar vídeos");
  }

  return response.json();
};
