"use client";
import { useState, useEffect, useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mixed, object, string } from "yup";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SkillsInput from "../shared/skillsInput";
import { Iuser } from "@/@types/user";
import { useUpdateProfileMutation } from "@/api/user";
import useToastify from "@/hooks/useToastify";

// Схема валидации
const settingsSchema = object({
  firstName: string().required("Имя обязательно").min(2, "min 2 characters"),
  lastName: string().required("Фамилия обязательна").min(2, "min 2 characters"),
  description: string().optional(),
  skills: string().optional(),
  avatar: mixed<File>()
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      if (originalValue instanceof FileList) {
        return originalValue.length > 0 ? originalValue[0] : null;
      }
      return value;
    })
    .nullable()
    .test("fileSize", "File is too large (max 5MB)", (value) => {
      if (!value) return true;
      return value instanceof File && value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only (JPG, PNG) Files", (value) => {
      if (!value) return true;
      const allowedExtensions = [".jpg", ".jpeg", ".png"];
      const fileName = value.name?.toLowerCase();
      return allowedExtensions.some((ext) => fileName?.endsWith(ext));
    })
    .test(
      "dimensions",
      "Image is too large (maximum 2000x2000 pixels)",
      (value): Promise<boolean> | boolean => {
        if (!value) return true;
        if (!(value instanceof File)) return true;
        const url = URL.createObjectURL(value);
        // Используем window.Image для явного указания типа
        const img: HTMLImageElement = new window.Image();
        img.src = url;
        return new Promise<boolean>((resolve) => {
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img.width <= 2000 && img.height <= 2000);
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(false);
          };
        });
      },
    ),
});

// Интерфейс для формы
interface Inputs {
  firstName: string;
  lastName: string;
  description?: string;
  skills?: string;
  avatar?: File | null;
}

const SettingsForm: React.FC<
  Pick<
    Iuser,
    "first_name" | "second_name" | "description" | "skills" | "img_url"
  >
> = ({ first_name, second_name, description, skills, img_url }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<Inputs>({
    resolver: yupResolver(settingsSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: first_name,
      lastName: second_name,
      description: description || "",
      skills: skills?.join(", ") || "",
      avatar: null,
    },
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { toastSuccess, toastError } = useToastify();
  const avatarFile = watch("avatar");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Локальное состояние для превью аватарки. Инициализируем текущим URL.
  const [avatarPreview, setAvatarPreview] = useState<string>(
    img_url || "/avatar.png",
  );

  // Обновляем превью при изменении файла или если отсутствует выбранный файл
  useEffect(() => {
    if (avatarFile && avatarFile instanceof File && !errors.avatar) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
    setAvatarPreview(img_url || "/avatar.png");
  }, [avatarFile, errors.avatar, img_url]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0] || null;
    if (file) {
      setValue("avatar", file, { shouldValidate: true });
    }
  };

  // Сбрасываем значения при изменении пропсов (только текстовые поля)
  useEffect(() => {
    reset({
      firstName: first_name || "",
      lastName: second_name || "",
      description: description || "",
      skills: skills?.join(", ") || "",
      // avatar оставляем без изменений
    });
  }, [first_name, second_name, description, skills, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data.firstName);
    formData.append("second_name", data.lastName);
    formData.append("description", data.description || "");
    formData.append("skills", data.skills || "");
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    updateProfile(formData)
      .unwrap()
      .then(() => toastSuccess("Profile updated successfully"))
      .catch(() => toastError("Failed to update profile"));
  };

  // Исходные значения, к которым будет сброс
  const initialValues = {
    firstName: first_name || "",
    lastName: second_name || "",
    description: description || "",
    skills: skills?.join(", ") || "",
    avatar: null,
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-h-[calc(100vh-48px)] w-[65%] border bg-black p-8 pr-2"
    >
      <div className="flex w-full flex-col gap-y-6 overflow-y-auto pr-4 scrollbar-thin scrollbar-webkit">
        {/* Поля формы */}
        <div className="flex items-center gap-x-5">
          <div className="flex w-full flex-col gap-y-[2px]">
            <label className="text-light-transparent text-[12px]">Имя</label>
            <Input
              {...register("firstName")}
              error={errors.firstName}
              variant="second"
              placeholder="Enter your First Name"
            />
          </div>
          <div className="flex w-full flex-col gap-y-[2px]">
            <label className="text-light-transparent text-[12px]">
              Фамилия
            </label>
            <Input
              {...register("lastName")}
              error={errors.lastName}
              variant="second"
              placeholder="Enter your Last Name"
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-y-[2px]">
          <label className="text-light-transparent text-[12px]">
            About myself
          </label>
          <textarea
            {...register("description")}
            className="h-[108px] resize-none border-b-[1px] bg-black py-3 text-[12px] scrollbar-thin scrollbar-webkit focus:outline-none"
            placeholder="Description..."
          ></textarea>
        </div>

        <div className="border-light-solid mt-5 flex gap-x-8 border-b-[1px] pb-4">
          <div className="relative w-[20%]">
            <label className="absolute -top-7 text-[12px] text-white/50">
              Avatar
            </label>
            <Image
              width={140}
              height={140}
              alt="avatar"
              className="h-[140px] w-[140px] rounded-[50%] object-cover object-center"
              src={avatarPreview}
            />
          </div>

          <div
            className="relative flex h-[140px] w-[80%] cursor-pointer flex-col items-center justify-center border border-dashed"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Controller
              name="avatar"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, onBlur, ref } }) => (
                <input
                  ref={(e) => {
                    ref(e);
                    fileInputRef.current = e;
                  }}
                  className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                    setValue("avatar", file, { shouldValidate: true });
                  }}
                  onBlur={onBlur}
                />
              )}
            />
            <p className="mt-4 text-center text-[14px]">
              Drag and drop image or{" "}
              <a className="ml-2 text-primary underline">Upload</a>
              <br />
              (resolution up to 2,000 x 2,000 px)
            </p>
          </div>
        </div>
        {errors.avatar && (
          <p className="text-red-500">{errors.avatar.message}</p>
        )}

        <SkillsInput
          value={watch("skills") || ""}
          onChange={(newSkills) =>
            setValue("skills", newSkills, { shouldDirty: true })
          }
        />

        <div className="mt-[100px] flex items-center justify-between">
          <div className="flex items-center gap-x-5">
            <Button
              variant="secondary"
              onClick={() => reset(initialValues)}
              disabled={!isDirty}
            >
              Cancel
            </Button>
            <Button
              disabled={!isDirty || isLoading}
              isLoading={isLoading}
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SettingsForm;
