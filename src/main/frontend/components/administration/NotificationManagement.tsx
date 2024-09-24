import React, {useEffect, useState} from "react";
import withConfigPage from "Frontend/components/administration/withConfigPage";
import * as Yup from 'yup';
import ConfigFormField from "Frontend/components/administration/ConfigFormField";
import Section from "Frontend/components/general/Section";
import {
    Button,
    Card,
    Chip,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import {MessageTemplateEndpoint, NotificationEndpoint} from "Frontend/generated/endpoints";
import {toast} from "sonner";
import {PaperPlaneRight, Pencil} from "@phosphor-icons/react";
import MessageTemplateDto from "Frontend/generated/de/grimsi/gameyfin/notifications/templates/MessageTemplateDto";
import TemplateType from "Frontend/generated/de/grimsi/gameyfin/notifications/templates/TemplateType";
import {Form, Formik} from "formik";
import Input from "Frontend/components/general/Input";

function NotificationManagementLayout({getConfig, getConfigs, formik}: any) {

    const editorModal = useDisclosure();
    const testNotificationModal = useDisclosure();
    const [availableTemplates, setAvailableTemplates] = useState<MessageTemplateDto[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplateDto | null>(null);
    const [templateContent, setTemplateContent] = useState<string>("");
    const [defaultPlaceholders, setDefaultPlaceholders] = useState<string[]>([]);

    useEffect(() => {
        MessageTemplateEndpoint.getAll().then((response: any) => {
            setAvailableTemplates(response as MessageTemplateDto[]);
        });
    }, []);

    async function verifyCredentials(provider: string) {
        const credentials: Record<string, any> = {
            host: formik.values.notifications.providers.email.host,
            port: formik.values.notifications.providers.email.port,
            username: formik.values.notifications.providers.email.username,
            password: formik.values.notifications.providers.email.password
        }

        const areCredentialsValid = await NotificationEndpoint.verifyCredentials(provider, credentials);

        if (areCredentialsValid) {
            toast.success("Credentials are valid")
        } else {
            toast.error("Credentials are invalid")
        }
    }

    async function openEditor(template: MessageTemplateDto) {
        setSelectedTemplate(template);

        let templateContent = await MessageTemplateEndpoint.read(template.key, TemplateType.MJML);
        let defaultPlaceholders = await MessageTemplateEndpoint.getDefaultPlaceholders(TemplateType.MJML);
        setDefaultPlaceholders(defaultPlaceholders ? defaultPlaceholders as string[] : []);

        if (templateContent === undefined) {
            toast.error("Can't read template content");
            return;
        }

        setTemplateContent(templateContent);
        editorModal.onOpen();
    }

    function openTestNotification(template: MessageTemplateDto) {
        setSelectedTemplate(template);
        testNotificationModal.onOpen();
    }

    async function saveTemplate(template: MessageTemplateDto) {
        await MessageTemplateEndpoint.save(template.key, TemplateType.MJML, templateContent);
    }

    function generateValidationSchema(placeholders: string[]) {
        const shape: { [key: string]: Yup.StringSchema } = {};
        placeholders.forEach(placeholder => {
            shape[placeholder] = Yup.string().required(`Placeholder ${placeholder} is required`);
        });
        return Yup.object().shape(shape);
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col flex-1">
                    <div className="flex flex-row gap-8">
                        <div className="flex flex-col flex-1">
                            <Section title="E-Mail"/>
                            <ConfigFormField configElement={getConfig("notifications.providers.email.enabled")}/>
                            <ConfigFormField configElement={getConfig("notifications.providers.email.host")}
                                             isDisabled={!formik.values.notifications.providers.email.enabled}/>
                            <ConfigFormField configElement={getConfig("notifications.providers.email.port")}
                                             isDisabled={!formik.values.notifications.providers.email.enabled}/>
                            <ConfigFormField configElement={getConfig("notifications.providers.email.username")}
                                             isDisabled={!formik.values.notifications.providers.email.enabled}/>
                            <ConfigFormField configElement={getConfig("notifications.providers.email.password")}
                                             type="password"
                                             isDisabled={!formik.values.notifications.providers.email.enabled}/>
                            <Button onPress={() => verifyCredentials("email")}
                                    isDisabled={!(
                                        formik.values.notifications.providers.email.enabled &&
                                        formik.values.notifications.providers.email.host &&
                                        formik.values.notifications.providers.email.port &&
                                        formik.values.notifications.providers.email.username)}>Test</Button>
                        </div>
                        <div className="flex flex-col flex-1">
                            <Section title="Message Templates"/>
                            <div className="flex flex-col gap-4">
                                {availableTemplates.map((template: MessageTemplateDto) =>
                                    <Card className="flex flex-row items-center gap-2 p-4" key={template.key}>
                                        <Tooltip content="Edit template">
                                            <Button isIconOnly
                                                    size="sm"
                                                    onPress={() => openEditor(template)}
                                            >
                                                <Pencil/>
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Send test notification">
                                            <Button isIconOnly
                                                    size="sm"
                                                    onPress={() => openTestNotification(template)}
                                            >
                                                <PaperPlaneRight/>
                                            </Button>
                                        </Tooltip>
                                        <p className="text-lg">{template.description}</p>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={editorModal.isOpen} onOpenChange={editorModal.onOpenChange} size="5xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader
                                className="flex flex-col gap-1">Edit {selectedTemplate?.name} Template</ModalHeader>
                            <ModalBody>
                                <div className="flex flex-row justify-between items-end">
                                    <table cellPadding="4rem">
                                        <tbody>
                                        <tr>
                                            <td>Required placeholders:</td>
                                            <td>
                                                <div className="flex flex-row gap-2">
                                                    {selectedTemplate?.availablePlaceholders?.map((placeholder) =>
                                                        <Chip radius="sm"
                                                              key={placeholder}
                                                              color={templateContent.includes(`{${placeholder as string}}`) ? "success" : "danger"}
                                                        >{placeholder}</Chip>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Optional placeholders:</td>
                                            <td>
                                                <div className="flex flex-row gap-2">
                                                    {defaultPlaceholders.map((placeholder) =>
                                                        <Chip radius="sm"
                                                              key={placeholder}
                                                              color={templateContent.includes(`{${placeholder as string}}`) ? "success" : "default"}
                                                        >{placeholder}</Chip>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <small className="text-right">Powered by <Link href="https://documentation.mjml.io/"
                                                                                   target="_blank">mjml.io</Link>
                                    </small>
                                </div>
                                <Textarea
                                    size="lg"
                                    autoFocus
                                    disableAutosize
                                    value={templateContent}
                                    onChange={(e) => {
                                        setTemplateContent(e.target.value)
                                    }}
                                    classNames={{
                                        input: "resize-y min-h-[500px]"
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={async () => {
                                    if (selectedTemplate) {
                                        await saveTemplate(selectedTemplate,);
                                        toast.success("Template saved")
                                        onClose();
                                    }
                                }}>
                                    Save
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={testNotificationModal.isOpen} onOpenChange={testNotificationModal.onOpenChange} size="3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <Formik
                                initialValues={{}}
                                onSubmit={async (values) => {
                                    await NotificationEndpoint.sendTestNotification(selectedTemplate?.key, values);
                                    toast.success("Test notification to you has been sent");
                                    onClose();
                                }}
                                validationSchema={generateValidationSchema(selectedTemplate?.availablePlaceholders as string[])}
                            >
                                <Form>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Send {selectedTemplate?.name} Test Message
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="text-ls font-semibold mb-4">Fill the placeholders of the
                                            template</p>
                                        {selectedTemplate?.availablePlaceholders?.map((placeholder) =>
                                            <Input key={placeholder} label={placeholder} name={placeholder}/>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" type="submit">
                                            Send
                                        </Button>
                                    </ModalFooter>
                                </Form>
                            </Formik>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

const validationSchema = Yup.object({});

export const NotificationManagement = withConfigPage(NotificationManagementLayout, "Notifications", "notifications", validationSchema);