import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Radio,
  RadioGroup,
  VStack,
  HStack,
  Text,
  Box,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import useCustomToast from "../../hooks/useCustomToast";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: any) => void;
  selectedDate: { startStr: string; endStr: string; allDay: boolean } | null;
}

interface EventFormValues {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reminderOffset: number;
  allDay: boolean;
  color: string | null;
  eventType: string;
  sendEmail: boolean;
}

const eventTypes = ["workingDay", "sickDay", "vacation", "weekend"];
const colors = ["red", "skyblue", "green", "violet", "orange", "pink"];

const AddEventModal: React.FC<AddEventModalProps> = ({
                                                       isOpen,
                                                       onClose,
                                                       onAddEvent,
                                                       selectedDate,
                                                     }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm<EventFormValues>({
    defaultValues: {
      reminderOffset: 15,
      sendEmail: true,
      color: null,
      eventType: "workingDay",
    },
  });

  const showToast = useCustomToast();

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedDate) {
      const start = new Date(selectedDate.startStr);
      const end = selectedDate.endStr ? new Date(selectedDate.endStr) : start;

      if (selectedDate.allDay) {
        setValue("startDate", "");
        setValue("endDate", "");
      } else {
        setValue("startDate", start.toTimeString().slice(0, 5));
        setValue("endDate", end.toTimeString().slice(0, 5));
      }
    }
  }, [selectedDate, setValue]);

  const onSubmit: SubmitHandler<EventFormValues> = (data) => {
    if (!selectedDate) return;

    const startDate = selectedDate.startStr.split("T")[0];
    const endDate = selectedDate.endStr
        ? new Date(selectedDate.endStr).toISOString().split("T")[0]
        : startDate;

    const formattedStartDate = new Date(`${startDate}T${data.startDate}`).toISOString();
    const formattedEndDate = new Date(`${endDate}T${data.endDate}`).toISOString();

    const newEvent = {
      title: data.title,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      reminderOffset: data.reminderOffset,
      allDay: selectedDate.allDay,
      description: data.description,
      color: data.color,
      workingDay: data.eventType === "workingDay",
      sickDay: data.eventType === "sickDay",
      vacation: data.eventType === "vacation",
      weekend: data.eventType === "weekend",
      sendEmail: data.sendEmail,
    };

    onAddEvent(newEvent);
    showToast("Create!", "Event created successfully.", "success");
    reset();
    handleClose();
  };


  return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="lg" fontWeight="bold">
              Selected Date:{" "}
              {selectedDate
                  ? `${new Date(selectedDate.startStr).toLocaleDateString()} ${
                      selectedDate.endStr
                          ? `- ${new Date(
                              new Date(selectedDate.endStr).setDate(
                                  new Date(selectedDate.endStr).getDate() - 1
                              )
                          ).toLocaleDateString()}`
                          : ""
                  }`
                  : "N/A"}
            </Text>

            <FormControl isRequired mt={4}>
              <FormLabel>Event Title</FormLabel>
              <Input placeholder="Enter event title" {...register("title", { required: true })} />
            </FormControl>

            <HStack mt={4}>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input type="time" {...register("startDate", { required: true })} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <Input type="time" {...register("endDate", { required: true })} />
              </FormControl>
            </HStack>

            <FormControl mt={4}>
              <FormLabel>Reminder Offset (minutes)</FormLabel>
              <Controller
                  name="reminderOffset"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                      <NumberInput min={1} maxW={24} value={value} onChange={(_, val) => onChange(val)}>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                  )}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Enter event description" {...register("description")} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Event Color</FormLabel>
              <Controller
                  control={control}
                  name="color"
                  render={({ field: { value, onChange } }) => (
                      <HStack spacing={2}>
                        {colors.map((color) => (
                            <Box
                                key={color}
                                width="30px"
                                height="30px"
                                borderRadius="md"
                                cursor="pointer"
                                bg={color}
                                border={value === color ? "3px solid black" : "1px solid gray"}
                                onClick={() => onChange(color)}
                            />
                        ))}
                      </HStack>
                  )}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Event Type</FormLabel>
              <Controller
                  control={control}
                  name="eventType"
                  rules={{ required: true }}
                  render={({ field }) => (
                      <RadioGroup {...field}>
                        <VStack align="start">
                          {eventTypes.map((type) => (
                              <Radio key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Radio>
                          ))}
                        </VStack>
                      </RadioGroup>
                  )}
              />
            </FormControl>

            <FormControl mt={4}>
              <Controller
                  control={control}
                  name="sendEmail"
                  render={({ field: { value, onChange } }) => (
                      <Checkbox
                          size="lg"
                          colorScheme="orange"
                          isChecked={value}
                          onChange={(e) => onChange(e.target.checked)}
                      >
                        Send Event
                      </Checkbox>
                  )}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="primary" mr={3} type="submit">
              Add Event
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default AddEventModal;
