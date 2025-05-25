import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Td,
    useDisclosure
} from "@chakra-ui/react";


import DOMPurify from "dompurify";

// Компонент для відображення HTML-контенту
interface SafeHtmlComponentProps {
    htmlContent: string; // Вказуємо, що це рядок
}

interface ExpandableTdProps {
    content: string; // Явно вказуємо, що content — це рядок
}
const SafeHtmlComponent: React.FC<SafeHtmlComponentProps> = ({ htmlContent }) => {
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />;
};

interface ContentModalProps {
    isOpen: boolean; // Тип для стану відкриття модалки
    onClose: () => void; // Функція, яка закриває модалку
    content: string; // Вміст поста
}

// Компонент модального вікна
const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, content }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>The content of the post</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box whiteSpace="pre-wrap" padding="4px">
                        <SafeHtmlComponent htmlContent={content || "N/A"} />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

// Основний компонент для відображення комірки з модалкою
const ExpandableTd: React.FC<ExpandableTdProps> = ({ content }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Td maxWidth="200px" padding="8px" onClick={onOpen} cursor="pointer">
                <Box
                    maxHeight="120px"
                    overflowY="hidden"
                    whiteSpace="normal"
                    padding="4px"
                    // border="1px solid #ccc"
                    borderRadius="md"
                >
                    <SafeHtmlComponent htmlContent={content || "N/A"} />
                </Box>
            </Td>

            <ContentModal isOpen={isOpen} onClose={onClose} content={content} />
        </>
    );
};

export default ExpandableTd
