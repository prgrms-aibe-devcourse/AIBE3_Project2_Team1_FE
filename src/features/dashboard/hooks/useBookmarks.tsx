import { axiosInstance } from '@/services/axios';
import { useEffect, useState } from 'react';

export interface BookmarkItem {
  id: number;
  projectId: number;
  title: string;
  image: string;
}

interface BookmarkResponse {
  id: number;
  projectId: number;
  userId: number;
}

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axiosInstance.get('/bookmarks');
        const bookmarkList: BookmarkResponse[] = res.data.data;

        if (!bookmarkList || bookmarkList.length === 0) {
          setBookmarks([]);
          return;
        }

        const projectPromises = bookmarkList.map(async (b) => {
          try {
            const projectRes = await axiosInstance.get(`/projects/${b.projectId}`);
            const project = projectRes.data.data;

            return {
              id: b.id,
              projectId: b.projectId,
              title: project.title ?? '제목 없음',
              image: project.projectImageList?.[0]?.fileUrl || '/no-image.png',
            } as BookmarkItem;
          } catch (err) {
            console.warn(`프로젝트 ${b.projectId} 불러오기 실패`, err);

            return {
              id: b.id,
              projectId: b.projectId,
              title: '(삭제된 프로젝트)',
              image: '/no-image.png',
            } as BookmarkItem;
          }
        });

        const bookmarksWithProjects = await Promise.all(projectPromises);
        setBookmarks(bookmarksWithProjects);
      } catch (err) {
        console.error('북마크 불러오기 실패:', err);
        setError('북마크 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return { bookmarks, loading, error };
}
