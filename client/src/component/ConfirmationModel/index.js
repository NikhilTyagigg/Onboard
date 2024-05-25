import React, { useState } from 'react'
import { 
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter 
} from "reactstrap";
import './index.scss'


const ConfirmationModel = ({header, content, onConfirm, onCancel, visible}) => {

    if(visible){
        return (
            <Modal isOpen={visible}>
                <ModalHeader>{header}</ModalHeader>
                <ModalBody>
                    {content}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onConfirm} color="primary" >Confirm</Button>{' '}
                    <Button onClick={onCancel} color="secondary" >Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }else{
        return <></>
    }
}

export default ConfirmationModel