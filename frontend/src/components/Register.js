import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import SideNavBtn from "./SideNavBtn";
import { BsCloudUploadFill } from 'react-icons/bs';

function Register() {
    const [category, setCategory] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        itemCategory: '',
        itemName: '',
        itemFeature: '',
        finderName: '',
        foundLocation: '',
        postContent: ''
    });
    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        const getCurrentDateTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };
        setCurrentDateTime(getCurrentDateTime());
    }, []);

    const navigate = useNavigate();

    const handleCategorySelect = (category) => {
        setCategory(category);
        setFormData((prevFormData) => ({
            ...prevFormData,
            itemCategory: category
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('lostItem', JSON.stringify({
            lostName: formData.itemName,
            date: currentDateTime,
            location: formData.foundLocation,
            description: formData.postContent,
            category: formData.itemCategory
        }));

        try {
            const response = await axios.post('lost-items', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/Management');
            console.log('Success:', response.data);
            alert('게시글이 등록되었습니다!');
        } catch (error) {
            console.error('Error:', error);
            alert('게시글 등록에 실패했습니다. 파일형식이 jpg,png이거나 파일 크기가 30mb이하만 업로드 가능합니다.');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move'; // 드래그 중 커서 모양을 '이동'으로 설정
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileChange(e);
    };

    return (
        <div className="register">
            <div className="register-nav-container"></div>
            <NavigationBar />
            <SideNavBtn />
            <div className="lost-register-banner">
                <div className="lost-register-banner-title">분실물 등록</div>
                <img className="register-top-img" src="/images/testimages/intro_05.jpg" alt="banner"/>
            </div>
            <div className="bread-crumb">
                <div className="bread-crumb-02">
                    <div className="bread-crumb-text-2">분실물 등록</div>
                </div>
                <div className="bread-crumb-01">
                    <Link to="/management" className="bread-crumb-text-1">
                        <button>분실물 서비스 관리</button>
                    </Link>
                </div>
            </div>

            <div className="lost-register-upload">
                <div
                    className="lost-register-upload-lost-image-frame"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {!imageSrc && (
                        <div className="lost-register-upload-lost-image-frame-text">
                            <label htmlFor="file-upload" className="file-upload-label">
                                <BsCloudUploadFill size={50} color="#3f51b5" />
                                <div>파일을 업로드 해주세요.</div>
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}
                    {imageSrc && <img src={imageSrc} alt="Preview" id="image-preview" />}
                </div>

                <div className="lost-register-upload-info-auto">
                    <div className="item-category">
                        <input
                            type="text"
                            id="itemCategory"
                            value={formData.itemCategory}
                            onChange={handleInputChange}
                            placeholder="분류"
                            className="item-category-input"
                        />
                    </div>
                    <div className="register-date">
                        <input
                            className="register-date-input"
                            placeholder="등록날짜"
                            type="text"
                            id="currentDateTime"
                            value={currentDateTime}
                            readOnly
                        />
                    </div>
                </div>

                <div className="lost-register-upload-info-input">
                    <div className="item-name">
                        <input
                            type="text"
                            id="itemName"
                            value={formData.itemName}
                            onChange={handleInputChange}
                            placeholder="습득물 이름"
                            className="item-name-input"
                        />
                    </div>
                    <div className="found-location">
                        <input
                            type="text"
                            id="foundLocation"
                            value={formData.foundLocation}
                            onChange={handleInputChange}
                            placeholder="습득 장소"
                            className="found-location-input"
                        />
                    </div>
                    <div className="post-content">
                        <textarea
                            id="postContent"
                            rows="4"
                            value={formData.postContent}
                            onChange={handleInputChange}
                            placeholder="게시글 내용 (상세한 설명)"
                            className="post-content-textarea"
                        />
                    </div>
                </div>

                <button className="submit-btn" type="submit" onClick={handleSubmit}>분실물 등록하기</button>
            </div>
        </div>
    );
}

export default Register;
