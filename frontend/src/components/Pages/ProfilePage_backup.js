
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ProfilePage.css'; // Import custom CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        companyMail: '',
        personalMail: '',
        bio: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropperInstance, setCropperInstance] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/profile/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProfile(response.data.admin);
                setFormData({
                    fullName: response.data.admin.fullName,
                    companyName: response.data.admin.companyName,
                    companyMail: response.data.admin.companyMail,
                    personalMail: response.data.admin.personalMail,
                    bio: response.data.admin.bio,
                });
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
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('companyMail', formData.companyMail);
            formDataToSend.append('personalMail', formData.personalMail);
            formDataToSend.append('bio', formData.bio);

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
            setProfile(response.data.admin); // Ensure profile state updates with the new image URL
            setEditMode(false); // Close edit mode
            toast.success('Profile updated successfully!'); // Show success notification
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile'); // Show error notification
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
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

    return (
        <div className="profile-container">
            <ToastContainer />
            <h2 className="profile-title">Admin Profile</h2>
            <div className="profile-header">
                <img
                    src={profile?.profilePicture ? `http://localhost:5000${profile.profilePicture}` : profilePicture}
                    alt="Profile"
                    className="profile-image"
                />

                <div className="profile-details">
                    <h3 className="profile-name">{profile?.fullName}</h3>
                    {/* <p className="profile-joined">Joined: {new Date(profile?.createdAt).toLocaleDateString()}</p> */}
                    <p className="profile-bio">{profile?.companyName}</p>
                    {/* <p className="profile-role">Role: {profile?.role}</p> */}
                </div>
            </div>
            <div className="profile-info">
                <p className="profile-email">Company Email: {profile?.companyMail}</p>
                <p className="profile-email">Personal Email: {profile?.personalMail}</p>
                {/* <p className="profile-phone">Phone Number: {profile?.phone}</p> */}
            </div>
            {editMode ? (
                <form className="profile-form">
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
            ) : (
                <button onClick={() => setEditMode(true)} className="btn btn-primary">
                    <i className="fa fa-edit"></i> Edit Profile
                </button>
            )}
            <button onClick={() => window.location.href = '/forgot-password'} className="btn btn-secondary">
                <i className="fa fa-lock"></i> Change Password
            </button>
            
        </div>
    );
};

export default ProfilePage;