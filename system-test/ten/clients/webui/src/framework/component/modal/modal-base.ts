import { ModalData } from "src/framework";

export interface ModalBase {
    initialize?(data: ModalData): void;
    initializeAsync?(data: ModalData): Promise<void>;
}