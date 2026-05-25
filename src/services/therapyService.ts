import api from "./api";

export interface CompletedExerciseDTO {
  chapter_id: string;
  exercise_id: string;
  rating: number;
  remarks: string;
  completed_at: string;
}

interface ProgressResponse {
  completed_exercises: CompletedExerciseDTO[];
  total_completed: number;
}

export const therapyService = {
  markComplete: async (params: {
    chapterId: string;
    exerciseId: string;
    rating: number;
    remarks: string;
  }): Promise<CompletedExerciseDTO> => {
    const res = await api.post<CompletedExerciseDTO>("/therapy/progress", {
      chapter_id: params.chapterId,
      exercise_id: params.exerciseId,
      rating: params.rating,
      remarks: params.remarks,
    });
    return res.data;
  },

  getProgress: async (): Promise<ProgressResponse> => {
    const res = await api.get<ProgressResponse>("/therapy/progress");
    return res.data;
  },
};
