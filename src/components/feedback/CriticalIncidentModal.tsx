import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import type { Incident } from "../../features/incidents/incidentsSlice";

interface CriticalIncidentModalProps {
    isOpen: boolean;
    incident: Incident | null;
    onClose: () => void;
}

export const CriticalIncidentModal = ({ isOpen, incident, onClose }: CriticalIncidentModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="lg">
            <ModalContent className="bg-danger-50 border border-danger-200 dark:bg-danger-900/20 dark:border-danger/50">
                <ModalHeader className="flex gap-3 text-danger">
                    <div className="p-2 bg-danger/10 rounded-full">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span>New CRITICAL Incident Detected</span>
                        <span className="text-tiny font-normal text-danger-500">Immediate attention required</span>
                    </div>
                </ModalHeader>
                <ModalBody>
                    {incident && (
                        <div className="space-y-4 p-4 rounded-lg bg-background/50">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs uppercase text-default-500 font-semibold">Category</p>
                                    <p className="font-medium">{incident.category}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-default-500 font-semibold">Source</p>
                                    <p className="font-mono text-small">{incident.source}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs uppercase text-default-500 font-semibold">Time</p>
                                    <p>{new Date(incident.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" color="danger" onPress={onClose}>
                        Dismiss
                    </Button>
                    <Button className="bg-danger text-white shadow-lg shadow-danger/40" onPress={onClose}>
                        Acknowledge & Investigate
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
