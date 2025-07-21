// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
// import './ProfilePage.css'; // Import custom CSS file
// import { ToastContainer, toast } from 'react-toastify';

// const ProfilePage = () => {
//     const [profile, setProfile] = useState(null);
//     const [editMode, setEditMode] = useState(false);
//     const [formData, setFormData] = useState({
//         fullName: '',
//         companyName: '',
//         companyMail: '',
//         personalMail: '',
//         bio: '',
//     });
//     const [profilePicture, setProfilePicture] = useState(null);
//     const [croppedImage, setCroppedImage] = useState(null);
//     const [cropperInstance, setCropperInstance] = useState(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/profile/profile', {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 setProfile(response.data.admin);
//                 setFormData({
//                     fullName: response.data.admin.fullName,
//                     companyName: response.data.admin.companyName,
//                     companyMail: response.data.admin.companyMail,
//                     personalMail: response.data.admin.personalMail,
//                     bio: response.data.admin.bio,
//                 });
//             } catch (error) {
//                 console.error('Error fetching profile:', error);
//             }
//         };

//         fetchProfile();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSaveProfile = async () => {
//         try {
//             const formDataToSend = new FormData();
//             formDataToSend.append('fullName', formData.fullName);
//             formDataToSend.append('companyName', formData.companyName);
//             formDataToSend.append('companyMail', formData.companyMail);
//             formDataToSend.append('personalMail', formData.personalMail);
//             formDataToSend.append('bio', formData.bio);

//             if (croppedImage) {
//                 formDataToSend.append('profilePicture', croppedImage, 'profilePicture.png');
//             }

//             const response = await axios.put('http://localhost:5000/api/profile/profile-picture', formDataToSend, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             console.log('Updated Profile Response:', response.data);
//             setProfile(response.data.admin); // Ensure profile state updates with the new image URL
//             setEditMode(false); // Close edit mode
//             toast.success('Profile updated successfully!'); // Show success notification
//         } catch (error) {
//             console.error('Error updating profile:', error);
//             toast.error('Error updating profile'); // Show error notification
//         }
//     };

//     const handleCancelEdit = () => {
//         setEditMode(false);
//     };

//     const handleProfilePictureChange = (e) => {
//         if (e.target.files && e.target.files.length > 0) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setProfilePicture(e.target.result); // Correctly set the profile picture
//             };
//             reader.readAsDataURL(e.target.files[0]);
//         }
//     };

//     const handleCrop = () => {
//         if (cropperInstance) {
//             const canvas = cropperInstance.getCroppedCanvas({
//                 width: 200,
//                 height: 200,
//                 imageSmoothingQuality: 'high',
//             });

//             canvas.toBlob((blob) => {
//                 const file = new File([blob], 'profilePicture.png', { type: 'image/png' });
//                 setCroppedImage(file);  // Correctly setting the cropped image as a file
//                 setProfilePicture(URL.createObjectURL(blob)); // Updating UI preview
//             }, 'image/png');
//         }
//     };

//     return (
//         <div className="profile-container">
            
//             <h2 className="profile-title">Admin Profile</h2>
//             <div className="profile-header">
//                 <img
//                     src={profile?.profilePicture ? `http://localhost:5000${profile.profilePicture}` : profilePicture}
//                     alt="Profile"
//                     className="profile-image"
//                 />

//                 <div className="profile-details">
//                     <h3 className="profile-name">{profile?.fullName}</h3>
//                     <p className="profile-joined">Joined: {new Date(profile?.createdAt).toLocaleDateString()}</p>
//                     <p className="profile-role">Role: {profile?.role}</p>
//                 </div>
//             </div>
//             <div className="profile-info">
//                 <p className="profile-bio">Bio: {profile?.bio}</p>
//                 <p className="profile-email">Company Email: {profile?.companyMail}</p>
//                 <p className="profile-email">Personal Email: {profile?.personalMail}</p>
//                 <p className="profile-phone">Phone Number: {profile?.phone}</p>
//             </div>
//             {editMode ? (
//                 <form className="profile-form">
//                     <div className="form-group">
//                         <label className="form-label">Full Name</label>
//                         <input
//                             type="text"
//                             name="fullName"
//                             value={formData.fullName}
//                             onChange={handleInputChange}
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Company Name</label>
//                         <input
//                             type="text"
//                             name="companyName"
//                             value={formData.companyName}
//                             onChange={handleInputChange}
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Company Email</label>
//                         <input
//                             type="email"
//                             name="companyMail"
//                             value={formData.companyMail}
//                             onChange={handleInputChange}
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Personal Email</label>
//                         <input
//                             type="email"
//                             name="personalMail"
//                             value={formData.personalMail}
//                             onChange={handleInputChange}
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Bio</label>
//                         <textarea
//                             name="bio"
//                             value={formData.bio}
//                             onChange={handleInputChange}
//                             className="form-input"
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label className="form-label">Profile Picture</label>
//                         {profilePicture ? (
//                             <div>
//                                 <img src={profilePicture} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
//                                 <button type="button" onClick={() => setProfilePicture(null)} className="btn btn-danger">
//                                     <i className="fa fa-trash"></i> Remove
//                                 </button>
//                             </div>
//                         ) : (
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleProfilePictureChange}
//                                 className="form-input"
//                             />
//                         )}
//                         {profilePicture && (
//                             <div className="cropper-container">
//                                 <Cropper
//                                     src={profilePicture}
//                                     style={{ height: 400, width: '100%' }}
//                                     initialAspectRatio={1}
//                                     guides={false}
//                                     cropBoxResizable={false}
//                                     onInitialized={(instance) => setCropperInstance(instance)}
//                                     aspectRatio={1}
//                                     viewMode={1}
//                                     className="cropper"
//                                 />
//                                 <button type="button" onClick={handleCrop} className="btn btn-secondary crop-btn">
//                                     <i className="fa fa-crop"></i> Crop
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     <div className="form-buttons">
//                         <button type="button" onClick={handleSaveProfile} className="btn btn-success">
//                             <i className="fa fa-check"></i> Save
//                         </button>
//                         <button type="button" onClick={handleCancelEdit} className="btn btn-danger">
//                             <i className="fa fa-times"></i> Cancel
//                         </button>
//                     </div>
//                 </form>
//             ) : (
//                 <button onClick={() => setEditMode(true)} className="btn btn-primary">
//                     <i className="fa fa-edit"></i> Edit Profile
//                 </button>
//             )}
//             <button onClick={() => window.location.href = '/forgot-password'} className="btn btn-secondary">
//                 <i className="fa fa-lock"></i> Change Password
//             </button>
//         </div>
//     );
// };

// export default ProfilePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ProfilePage.css'; // Import custom CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Box, Button, Typography } from '@mui/material';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        companyMail: '',
        personalMail: '',
        bio: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropperInstance, setCropperInstance] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                console.log('Fetched Profile Data:', response.data);

                const profileData = response.data.profile;
                setProfile(profileData); // Store the entire profile object

                const userRole = profileData.role;
                localStorage.setItem('userRole', userRole); // Store role in local storage

                // Determine full name based on role
                const fullName = userRole === 'admin' 
                    ? profileData.fullName || '' 
                    : `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    fullName,
                    companyName: profileData.companyName || '',
                    companyMail: profileData.companyMail || '',
                    personalMail: profileData.personalMail || '',
                    bio: profileData.bio || '',
                    firstName: profileData.firstName || '',
                    lastName: profileData.lastName || '',
                    email: profileData.email || '',
                    phone: profileData.phone || '',
                }));

                console.log('Role after setting formData:', userRole);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveProfile = async () => {
        try {
            const formDataToSend = new FormData();
            if (profile.role === 'admin') {
                formDataToSend.append('fullName', formData.fullName);
                formDataToSend.append('companyName', formData.companyName);
                formDataToSend.append('companyMail', formData.companyMail);
                formDataToSend.append('personalMail', formData.personalMail);
                formDataToSend.append('bio', formData.bio);
            } else if (profile.role === 'user') {
                formDataToSend.append('firstName', formData.firstName);
                formDataToSend.append('lastName', formData.lastName);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('phone', formData.phone);
                formDataToSend.append('bio', formData.bio);
            }

            if (croppedImage) {
                formDataToSend.append('profilePicture', croppedImage, 'profilePicture.png');
            }

            const response = await axios.put('http://localhost:5000/api/profile/profile-picture', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Updated Profile Response:', response.data);
            setProfile(response.data.profile); // Ensure profile state updates with the new image URL
            setEditMode(false); // Close edit mode
            toast.success('Profile updated successfully!'); // Show success notification
            setOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile'); // Show error notification
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setOpen(false); // Close the modal
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicture(e.target.result); // Correctly set the profile picture
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCrop = () => {
        if (cropperInstance) {
            const canvas = cropperInstance.getCroppedCanvas({
                width: 200,
                height: 200,
                imageSmoothingQuality: 'high',
            });

            canvas.toBlob((blob) => {
                const file = new File([blob], 'profilePicture.png', { type: 'image/png' });
                setCroppedImage(file);  // Correctly setting the cropped image as a file
                setProfilePicture(URL.createObjectURL(blob)); // Updating UI preview
            }, 'image/png');
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh', // Set maximum height to 90% of viewport height
        overflowY: 'auto', // Enable vertical scrolling
    };

    return (
        <div className="profile-container">
            <ToastContainer />
            <h2 className="profile-title">
                {profile?.role === 'admin' ? 'Admin Profile' : 'User Profile'}
            </h2>

            <div className="profile-header">
                <img
                    src={profile?.profilePicture ? `http://localhost:5000${profile.profilePicture}` : profilePicture}
                    alt="Profile"
                    className="profile-image"
                />

                <div className="profile-details">
                    <h3 className="profile-name">
                        {profile?.fullName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim()}
                    </h3>

                    <p className="profile-bio">{profile?.companyName || profile?.bio}</p>
                </div>
            </div>
            <div className="profile-info">
                {profile?.role === 'admin' ? (
                    <>
                        <p className="profile-email">Company Email: {profile?.companyMail}</p>
                        <p className="profile-email">Personal Email: {profile?.personalMail}</p>
                    </>
                ) : (
                    <>
                        <p className="profile-email">Email: {profile?.email}</p>
                        <p className="profile-phone">Phone Number: {profile?.phone}</p>
                    </>
                )}
            </div>
            <button onClick={() => { setEditMode(true); setOpen(true); }} className="btn btn-primary">
                <i className="fa fa-edit"></i> Edit Profile
            </button>
            <Modal
                open={open}
                onClose={() => { setEditMode(false); setOpen(false); }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Profile
                    </Typography>
                    {editMode ? (
                        <form className="profile-form">
                            {profile?.role === 'admin' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Company Email</label>
                                        <input
                                            type="email"
                                            name="companyMail"
                                            value={formData.companyMail}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Personal Email</label>
                                        <input
                                            type="email"
                                            name="personalMail"
                                            value={formData.personalMail}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            className="form-input"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label className="form-label">Profile Picture</label>
                                {profilePicture ? (
                                    <div>
                                        <img src={profilePicture} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setProfilePicture(null)} className="btn btn-danger">
                                            <i className="fa fa-trash"></i> Remove
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="form-input"
                                    />
                                )}
                                {profilePicture && (
                                    <div className="cropper-container">
                                        <Cropper
                                            src={profilePicture}
                                            style={{ height: 400, width: '100%' }}
                                            initialAspectRatio={1}
                                            guides={false}
                                            cropBoxResizable={false}
                                            onInitialized={(instance) => setCropperInstance(instance)}
                                            aspectRatio={1}
                                            viewMode={1}
                                            className="cropper"
                                        />
                                        <button type="button" onClick={handleCrop} className="btn btn-secondary crop-btn">
                                            <i className="fa fa-crop"></i> Crop
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="form-buttons">
                                <button type="button" onClick={handleSaveProfile} className="btn btn-success">
                                    <i className="fa fa-check"></i> Save
                                </button>
                                <button type="button" onClick={handleCancelEdit} className="btn btn-danger">
                                    <i className="fa fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    ) : null}
                </Box>
            </Modal>
            <button onClick={() => window.location.href = '/forgot-password'} className="btn btn-secondary">
                <i className="fa fa-lock"></i> Change Password
            </button>
        </div>
    );
};

export default ProfilePage;