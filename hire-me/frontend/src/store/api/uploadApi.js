import { baseApi } from './baseApi';

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** arg: a File (jpg / png / webp, max 3 MB). Resolves with { url, publicId } - save both inside personalInformation.photo. */
    uploadPhoto: build.mutation({
      query: (file) => {
        const body = new FormData();
        body.append('photo', file);
        return { url: '/uploads/photo', method: 'POST', body };
      },
      transformResponse: (data) => data.photo,
    }),

    /** arg: publicId of a photo that was uploaded but never saved into a resume. */
    deletePhoto: build.mutation({
      query: (publicId) => ({ url: `/uploads/photo?publicId=${encodeURIComponent(publicId)}`, method: 'DELETE' }),
    }),
  }),
});

export const { useUploadPhotoMutation, useDeletePhotoMutation } = uploadApi;
