import React, { useState, useEffect, useRef } from 'react';
import UserChip from '../UserChip/UserChip';
import './UserPicker.css';

const UserPicker = () => {
    // Sample initial data
    const initialUsers = [
        { id: 1, name: 'Soham Newman', email: 'soham.newman@example.com' ,avatarUrl:'https://randomuser.me/api/portraits/men/86.jpg'},
        { id: 2, name: 'Denise Hall', email: 'deni.hall@abc.com', avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg'},
        { id: 3, name: 'Tracy Bing', email: 'tracy.bing@example.com',avatarUrl: 'https://randomuser.me/api/portraits/women/91.jpg'},
        { id: 4, name: 'Letitia George', email: 'letitia.george@example.com', avatarUrl: 'https://randomuser.me/api/portraits/women/81.jpg'},
        { id: 5, name: 'Ken Alvarez', email: 'ken.alvarez@example.com', avatarUrl: 'https://randomuser.me/api/portraits/men/54.jpg'},
        { id: 6, name: 'Calvin Jones', email: 'calvin.jones@abc.com', avatarUrl: 'https://randomuser.me/api/portraits/men/46.jpg'},
        { id: 7, name: 'Bradley Wells', email: 'bradley.wells@example.com', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'},
        { id: 8, name: 'Brad Grant', email: 'brad.grant@example.com', avatarUrl: 'https://randomuser.me/api/portraits/men/40.jpg'}
        
    ];

    // State hooks
    const [availableUsers, setAvailableUsers] = useState(initialUsers);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedUser, setHighlightedUser] = useState(null);
    // New state to keep track of the focused user index
    const [focusedUserIndex, setFocusedUserIndex] = useState(-1);
    // Ref for the user list
    const listRef = useRef(null);
    //Active status of search bar 
    const [isInputFocused, setIsInputFocused] = useState(false);



    // Effect hook to reset highlighted user when selected users change
    useEffect(() => {
        setHighlightedUser(null);
    }, [selectedUsers]);

    // Effect to reset focused user index when the list changes
    useEffect(() => {
        setFocusedUserIndex(-1);
    }, [searchTerm, availableUsers]);

    // Effect to handle scrolling into view for focused user
    useEffect(() => {
        if (focusedUserIndex >= 0 && listRef.current && listRef.current.children[focusedUserIndex]) {
            listRef.current.children[focusedUserIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [focusedUserIndex]);
      

    // User selection handler
    const selectUser = (user) => {
        setSelectedUsers(prevSelected => [...prevSelected, user]);
        setAvailableUsers(prevAvailable => prevAvailable.filter(u => u.id !== user.id));
        setSearchTerm('');
        setFocusedUserIndex(-1); // Reset focus when a user is selected
    };

    // User removal handler
    const removeUser = (userId) => {
        const user = selectedUsers.find(u => u.id === userId);
        setAvailableUsers([...availableUsers, user]);
        setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    };

    // Input change handler
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle key down event for backspace , up & down arrow
    const handleKeyDown = (event) => {
        if (event.key === 'Backspace' && searchTerm === '') {
            if (highlightedUser) {
                // Remove the highlighted user
                removeUser(highlightedUser.id);
                setHighlightedUser(null);
            } else if (selectedUsers.length > 0) {
                // Highlight the last user
                setHighlightedUser(selectedUsers[selectedUsers.length - 1]);
            }
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setFocusedUserIndex(i => Math.min(i + 1, filteredUsers.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setFocusedUserIndex(i => Math.max(i - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (focusedUserIndex >= 0) {
                // User has navigated the list, select the focused user
                selectUser(filteredUsers[focusedUserIndex]);
            } else if (filteredUsers.length > 0) {
                // No user is focused, select the first user in the filtered list
                selectUser(filteredUsers[0]);
            }
            
        }
    };

    // Filter users based on the search term
    const filteredUsers = searchTerm.length === 0
        ? availableUsers
        : availableUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
    
    // when clicked on the search btn dropdown appears
    const handleInputFocus = () => {
        setIsInputFocused(true);
    };
    
    const handleInputBlur = (event) => {
        // Delay hiding the dropdown
        if (!event.currentTarget.contains(event.relatedTarget)) {
            // Delay hiding the dropdown to allow for interaction with the dropdown
            setTimeout(() => {
                setIsInputFocused(false);
            }, 200);
        }
    };
      

    return (
        <div className="user-picker">
            <div className="selected-users">
                {selectedUsers.map(user => (
                    <UserChip
                        key={user.id}
                        user={user}
                        onRemove={() => removeUser(user.id)}
                        isHighlighted={highlightedUser?.id === user.id}
                    />
                ))}
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Add new user..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                {isInputFocused && filteredUsers.length > 0 ? (
                    <ul className="user-list" ref={listRef}>
                        {filteredUsers.map((user, index) => (
                        <li 
                            key={user.id} 
                            onClick={() => selectUser(user)}
                            onMouseDown={(event) => {
                                event.preventDefault(); // Prevent the input from losing focus
                                selectUser(user);
                            }}
                            onMouseOver={() => setFocusedUserIndex(index)}
                            className={index === focusedUserIndex ? 'focused' : ''}
                            tabIndex={0} 
                        >
                            <img src={user.avatarUrl} alt={`${user.name}`} className="user-avatar" />
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                        </li>
                        ))}
                    </ul>
                    ) : searchTerm.trim() !== '' && (
                    <div className="no-users-found">
                        User not found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPicker;

