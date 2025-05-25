
import {
    Box,
    Button,
    IconButton,
    Image,
    List,
    ListItem,
    Modal,
    Flex,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Tooltip,
    Textarea,
    useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRef, useEffect } from "react";

interface FilePreview {
    name: string;
    size: string;
    preview: string;
    file: File;
}

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    files: FilePreview[];
    onRemove: (index: number) => void;
    onUpload: () => void;
    message: string;
    onMessageChange: (value: string) => void;
    isDisabled?: boolean;
    onAddFiles: (newFiles: File[]) => void;

}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               files,
                                                               onRemove,
                                                               onUpload,
                                                               message,
                                                               onMessageChange,
                                                               isDisabled,
                                                               onAddFiles
                                                           }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [message]);
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Preview files</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* список файлів */}
                    <List spacing={3} mb={4}>
                        {files.map((file, index) => (
                            <ListItem
                                key={index}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Image
                                    src={file.preview}
                                    alt={file.name}
                                    boxSize="50px"
                                    objectFit="cover"
                                    borderRadius="md"
                                />
                                <Box flex="1" mx={4}>
                                    <Tooltip label={file.name} hasArrow placement="top">
                                        <Text fontWeight="bold" isTruncated maxW="200px">
                                            {file.name}
                                        </Text>
                                    </Tooltip>
                                    <Text fontSize="sm" color="gray.500">
                                        {file.size}
                                    </Text>
                                </Box>
                                <IconButton
                                    icon={<DeleteIcon />}
                                    aria-label="Remove file"
                                    size="sm"
                                    onClick={() => onRemove(index)}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Flex w="100%" align="flex-start" gap={1}>
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => onMessageChange(e.target.value)}
                            placeholder="Add message..."
                            resize="none"
                            minH="20px"
                            maxH="100px"
                            border="none"
                            borderBottom="2px solid"
                            borderColor={useColorModeValue("gray.300", "gray.600")}
                            focusBorderColor="teal.400"
                            borderRadius="0"
                            px="0"
                            py="0"
                            fontSize="sm"
                            lineHeight="1"
                            _placeholder={{ color: useColorModeValue("gray.500", "gray.400") }}
                            _focus={{
                                outline: "none",
                                borderColor: "teal.400",
                                boxShadow: "none",
                            }}
                            bg="transparent"
                            color={useColorModeValue("black", "white")}
                            overflow="hidden"
                            flex={1}
                            alignSelf="center"
                        />
                    </Flex>

                </ModalBody>

                <ModalFooter>
                    <Flex w="100%" justify="space-between" align="center" flexWrap="wrap" gap={2}>
                        {/* Зліва — кнопка додавання */}
                        <Box>
                            <Button as="label" variant="outline" size="sm" colorScheme="teal" cursor="pointer">
                                + Add
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const newFiles = Array.from(e.target.files);
                                            onAddFiles(newFiles);
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </Button>
                        </Box>

                        {/* Справа — завантажити та скасувати */}
                        <Flex gap={3}>
                            <Tooltip
                                label={
                                    isDisabled
                                        ? "Неможливо завантажити: кімната закрита або ви не власник каналу"
                                        : ""
                                }
                                isDisabled={!isDisabled}
                                hasArrow
                                placement="top"
                            >
                                <Button
                                    onClick={onUpload}
                                    colorScheme="teal"
                                    variant="outline"
                                    isDisabled={isDisabled}
                                    cursor={isDisabled ? "not-allowed" : "pointer"}
                                >
                                    Download
                                </Button>
                            </Tooltip>

                            <Button onClick={onClose} variant="outline">
                                Cancel
                            </Button>
                        </Flex>
                    </Flex>
                </ModalFooter>


            </ModalContent>
        </Modal>
    );
};

export default FilePreviewModal;
