import ClientHero from "@/components/client/sections/client-hero"
import ContentCarousel from "@/components/client/sections/content-carousel"
import FeaturedCourse from "@/components/client/sections/featured-course"
import { getVideos } from "@/lib/video-actions"

interface Video {
    id: string
    title: string
    thumbnailUrl?: string
    duration?: number
    createdAt: string
    muxPlaybackId: string;
}

const mapVideosToCarousel = (videos: Video[]) => {
    return videos.map((video) => (

        {
            id: video.muxPlaybackId || video.id,
            title: video.title,
            thumbnail: video.thumbnailUrl,
            duration: video.duration ? `${Math.floor(video.duration / 60)} min` : "",
            date: video.createdAt,
            muxPlaybackId: video.muxPlaybackId,
            tags: [],
        }))
}

const ClientHomePage = async () => {
    const videos = await getVideos()
    const carouselItems = mapVideosToCarousel(videos)

    return (
        <div className="pb-16">
            <ClientHero />
            <div className="mx-auto px-40">
                <section className="mt-6 px-4 md:px-8 lg:px-12">
                    <ContentCarousel title="Continuar assistindo" items={carouselItems} type="continue" />
                </section>
                <section className="mt-12 px-4 md:px-8 lg:px-12">
                    <FeaturedCourse />
                </section>
                <section className="mt-12 px-4 md:px-8 lg:px-12">
                    <ContentCarousel title="Cursos populares" items={carouselItems} type="course" />
                </section>
                <section className="mt-12 px-4 md:px-8 lg:px-12">
                    <ContentCarousel title="Vídeos recentes" items={carouselItems} type="video" />
                </section>
                <section className="mt-12 px-4 md:px-8 lg:px-12">
                    <ContentCarousel title="Recomendados para você" items={carouselItems} type="course" />
                </section>
                <section className="mt-12 px-4 md:px-8 lg:px-12">
                    <ContentCarousel title="Lives programadas" items={carouselItems} type="live" />
                </section>
            </div>
        </div>
    )
}

export default ClientHomePage
