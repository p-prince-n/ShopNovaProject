import { create } from "zustand";
import toast from "react-hot-toast";
export const useUploadStore = create((set) => ({
  imageUrl: "",
  uploadloading: false,
  uploaderror: null,
  progress: 0,

  uploadImage: (file) => {
    set({ uploadloading: true, uploaderror: null, progress: 0 });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "qwertus");

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://api.cloudinary.com/v1_1/du62uw7ti/image/upload");


    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total);
        set({ progress: percent });
      }
    });


    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          set({ imageUrl: response.secure_url, uploadloading: false, progress: 0});
          toast.success("Image uploaded successfully");
        } catch (err) {
          set({ uploaderror: "Invalid server response", uploadloading: false });
        }
      } else {
        set({ uploaderror: `Upload failed with status ${xhr.status}`, uploadloading: false });
      }
    };


    xhr.onerror = () => {
      set({ uploaderror: "Network error during upload", uploadloading: false });
    };


    xhr.send(formData);
  },
}));
