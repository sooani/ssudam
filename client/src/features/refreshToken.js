import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken, updateAccessToken } from '../features/userSlice';
import axios from 'axios';

const reissueToken = () => {
    const dispatch = useDispatch();
    const storedAccessToken = useSelector(selectAccessToken);

    useEffect(() => {
        if (!storedAccessToken) {
            const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            // 임시 주소 api 주소 나오면 변경하기
            const tokenRefreshEndpoint = '/v1/token/refresh';
            axios.post(tokenRefreshEndpoint, {
                grant_type: 'refresh_token',
                refreshToken,
            })
            .then(response => {
                const newAccessToken = response.data.accessToken;
          
                // 액세스 토큰 업데이트
                dispatch(updateAccessToken(newAccessToken));

                // 새로운 액세스 토큰을 로컬 스토리지에 저장
                localStorage.setItem('Authorization', newAccessToken);
            })
            .catch(error => {
                console.error('액세스 토큰 갱신 실패:', error);
            });
            }
        }
    }, [dispatch]);

    // 로그인 상태를 유지하기 위한 동작이 주요하므로, 반환값이 필요하지 않음 (빈 문자열 반환)
    return null;
};

export default reissueToken;
