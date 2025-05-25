import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,

} from "@chakra-ui/react";
import { useRef, useState } from "react";
import RichTextEditor from "../Editor/RichTextEditor.tsx";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type ApiError, BlogService, MediaService, type PostCreate } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { handleError } from "../../utils";

interface FileDetail {
  name: string;
  size: string;
  file: File;
  preview?: string;
}

interface PostCreateExtended extends PostCreate {
  images?: File[];
}

interface AddPostProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPost = ({ isOpen, onClose }: AddPostProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileDetail[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostCreateExtended>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      content: "",
      status: false,
      images: [],
    },
  });


  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file,
      preview: URL.createObjectURL(file), // Генеруємо URL для прев’ю
    }));

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    setValue(
        "images",
        [...(watch("images") || []), ...selectedFiles.map((f) => f.file)],
        { shouldValidate: true }
    );
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];

    // Очищаємо URL для запобігання витоку пам’яті
    URL.revokeObjectURL(updatedFiles[index].preview!);

    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const mutation = useMutation({
    mutationFn: async (jsonPayload: PostCreateExtended) => {
      // Створюємо пост
      // @ts-ignore
      const postResponse = await BlogService.createPost(jsonPayload);
      const postId = postResponse.ID;

      // Отримуємо файли
      const images = jsonPayload.images;
      if (postId && images && images.length > 0) {
        const formData = new FormData();

        images.forEach((file) => {
          formData.append("files", file); // Змінено на "images" (повинно відповідати бекенду)
        });

        console.log("Uploading images:", formData.getAll("images")); // Дебаг

        await MediaService.downloadImages(postId, formData);
      } else {
        console.warn("No images to upload.");
      }
    },
    onSuccess: () => {
      showToast("Success!", "Post created successfully.", "success");
      reset();
      setFiles([]);
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit: SubmitHandler<PostCreateExtended> = async (data) => {
    const payload: PostCreateExtended = {
      title: data.title,
      position: data.position,
      content: data.content,
      status: data.status,
      images: files.map((f) => f.file), // Передаємо файли
    };

    await mutation.mutateAsync(payload);
  };

  return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <RichTextEditor
                value={watch('title') || ''}
                onChange={(_, __, ___, editor) => {
                setValue('title', editor.getHTML());
              }}
                />
              {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.content}>
              <FormLabel htmlFor="description">Content</FormLabel>
              <RichTextEditor
                  value={watch('content') || ''}
                  onChange={(_, __, ___, editor) => {
                    setValue('content', editor.getHTML());
                  }}
              />
              {errors.content && (
                  <FormErrorMessage>{errors.content.message}</FormErrorMessage>
              )}
            </FormControl >

            <FormControl mt={4}>
              <FormLabel htmlFor="images">Images</FormLabel>
              <Input
                  ref={fileInputRef}
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                  hidden
                  disabled={isSubmitting}
              />
              <Button colorScheme="teal" variant="outline" onClick={handleFileButtonClick} mt={2} isLoading={isSubmitting}>
                Upload Images
              </Button>
              <Card>
                {files.length > 0 && (
                    <List spacing={2} mt={2}>
                      {files.map((file, index) => (
                          <ListItem
                              key={index}
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                          >
                            <Box display="flex" alignItems="center" gap={3}>
                              <img src={file.preview} alt={file.name} width="50" height="50" style={{ borderRadius: "5px" }} />
                              {file.name} - {file.size}
                            </Box>
                            <IconButton
                                icon={<CloseIcon />}
                                aria-label="Remove file"
                                onClick={() => handleRemoveFile(index)}
                            />
                          </ListItem>
                      ))}
                    </List>
                )}
              </Card>
            </FormControl>

            <FormControl mt={4} isInvalid={!!errors.position}>
              <FormLabel htmlFor="position">Position</FormLabel>
              <Input
                  id="position"
                  {...register("position", {
                    required: "Position is required.",
                    valueAsNumber: true,
                    min: { value: 1, message: "Position must be greater than 0" },
                  })}
                  placeholder="Enter position"
                  type="number"
              />
              {errors.position && <FormErrorMessage>{errors.position.message}</FormErrorMessage>}
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.status}>
              <FormLabel htmlFor="status" display="flex" alignItems="center" gap={2}>
                <Box width="12px" height="12px" borderRadius="full" bg={watch("status") ? "green.500" : "red.500"} />
                Status
              </FormLabel>
              <Switch id="status" {...register("status")} colorScheme="teal" />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default AddPost;
