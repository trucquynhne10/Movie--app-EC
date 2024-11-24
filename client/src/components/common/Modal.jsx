import Modal from 'react-modal'

const customStyles = {
    overlay: {
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#101010'
    }
}

export default ({ isOpen, children }) => {
    return (
        <Modal isOpen={isOpen} style={customStyles}>
            {children}
        </Modal>
    )
}
