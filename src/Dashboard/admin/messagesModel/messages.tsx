import React, { useEffect, useState } from 'react';
import { fetchMessages, deleteMessage, updateMessage } from "../../../utils/userApi";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Tooltip, TextField } from '@mui/material';
import MessageModal from './messageModel';

export interface MessageData {
  id: string;
  name: string;
  email: string;
  message: string;
}

const Messages: React.FC = () => {
  const [rows, setRows] = useState<MessageData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState<MessageData | null>(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const data = await fetchMessages();
        setRows(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    getMessages();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      setRows(rows.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleEdit = (message: MessageData) => {
    setCurrentMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async (updatedMessage: MessageData) => {
    try {
      await updateMessage(currentMessage!.id, updatedMessage);
      setRows(rows.map(row => (row.id === currentMessage!.id ? updatedMessage : row)));
      handleClose();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-10 ml-[250px]">
      <div className="flex justify-end mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          className="w-full max-w-xs"
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
        <TableHead>
  <TableRow sx={{ backgroundColor: 'purple' }}>
    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'Arial, sans-serif' }}>Name</TableCell>
    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'Arial, sans-serif' }}>Email</TableCell>
    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'Arial, sans-serif' }}>Message</TableCell>
    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem', fontFamily: 'Arial, sans-serif' }}>Actions</TableCell>
  </TableRow>
</TableHead>

          <TableBody>
  {rows
    .filter(row => row.name.toLowerCase().includes(searchQuery))
    .map(row => (
      <TableRow key={row.id} className="hover:bg-purple-300"> {/* Add hover class here */}
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.message}</TableCell>
        <TableCell>
          <Tooltip title="Delete">
            <DeleteOutlineIcon
              onClick={() => handleDelete(row.id)}
              className="cursor-pointer mr-2 transform transition-transform duration-200 hover:scale-110" // Add zoom effect here
              sx={{ color: 'red' }} // Set the delete icon color to red
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlinedIcon
              onClick={() => handleEdit(row)}
              className="cursor-pointer transform transition-transform duration-200 hover:scale-110" // Add zoom effect here
              sx={{ color: 'blue' }} // Set the edit icon color to blue
            />
          </Tooltip>
        </TableCell>
      </TableRow>
    ))}
</TableBody>


        </Table>
      </TableContainer>
      {open && currentMessage && (
        <MessageModal
          open={open}
          onClose={handleClose}
          message={currentMessage}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Messages;
