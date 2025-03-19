import React from "react";
import {  useEffect } from "react";
import axios from "axios";

// Pure CSS styles
const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '320px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#333333',
      margin: 0
    },
    closeButton: {
      border: 'none',
      background: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#999',
      padding: '0'
    },
    modalMessage: {
      fontSize: '14px',
      color: '#666666',
      marginBottom: '24px'
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px'
    },
    cancelButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#666',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    deleteButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: 'white',
      backgroundColor: '#f44336',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

const DeleteModal = ({ isOpen, onClose, onDelete, conversationId  }) => {
    if (!isOpen) return null;

    const deleteConversation = async (conversationId) => {
        console.log("ok")
        try {
          await axios.delete(`http://localhost:4000/api/conversations/${conversationId}`);
        } catch (error) {
          console.error("Error deleting conversation:", error);
        }
        window.location.reload();

      };

    return (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContainer}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>Delete chat?</h2>
                  <button 
                    onClick={onClose}
                    style={styles.closeButton}
                  >
                    ×
                  </button>
                </div>
                
                <p style={styles.modalMessage}>
                  Are you sure you want to delete this chat?
                </p>
                
                <div style={styles.modalFooter}>
                  <button
                    onClick={onClose}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => deleteConversation(conversationId)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

    );
};

export default DeleteModal;