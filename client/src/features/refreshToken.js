import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken, updateAccessToken } from '../features/userSlice';
import axios from 'axios';
import jwtDecode from 'jwt-decode'

const reissueToken = () => {
    const dispatch = useDispatch();
    const storedAccessToken = useSelector(selectAccessToken);

    const decodeAccessToken = token => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.log('JWT 디코딩 실패:', error);
            return null;
        }
    }

    useEffect(() => {
        if (storedAccessToken) {
            // 액세스 토큰의 만료 시간을 확인
            const expirationTime = decodeAccessToken(storedAccessToken)?.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            if (expirationTime && expirationTime - currentTime > 60) {
                // 액세스 토큰이 1분 이상 남아 있으면 갱신할 필요 없음
                return;
            }
        }

        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            // 임시 주소 나중에 변경하기
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
    }, [dispatch, storedAccessToken]);

    return null;
};

export default reissueToken;