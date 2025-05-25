import {
    Avatar,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    useColorModeValue,
    VStack,
    Button
} from "@chakra-ui/react";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        full_name: string;
        avatar: string;
        user_id: string;
    } | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
    if (!user) return null;

    const bg = useColorModeValue("white", "gray.800");

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent bg={bg}>
                <ModalHeader>Профіль користувача</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="center">
                        <Avatar size="xl" src={user.avatar} />
                        <Box textAlign="center">
                            <Text fontWeight="bold">{user.full_name}</Text>
                        </Box>

                        <Button
                            colorScheme="teal"
                            onClick={async () => {
                                if (!user?.user_id) return;
                            }}
                            w="100%"
                        >
                            Написати повідомлення
                        </Button>

                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UserProfileModal;
