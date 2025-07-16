import { Suspense, useEffect, useState } from "react";
import { css } from "@emotion/react";
import Avatar from "../../../components/Avatar";
import getProfileImages from "../../../api/get/getProfileImages";
import useFetch from "../../../api/useFetch";
import avatarDefaultImg from "../../../assets/images/img-avatar-default.png";
import { BREAKPOINTS } from "../../../constants/constants";
import Skeleton from "../../../components/Skeleton/Skeleton";

const SelectProfileImage = ({ onChange, onResponsive }) => {
  const [images, setImages] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(avatarDefaultImg);
  const [isImageDefault, setIsImageDefault] = useState(true);

  const { fetchError, fetchAsync } = useFetch(getProfileImages);

  const isMobile = onResponsive === "mobile";
  const avatarSkeletonSize = isMobile ? "40px" : "56px";

  const changeProfileImageUrl = ({ target }) => {
    const { src } = target;
    setProfileImageUrl(src);
    setIsImageDefault(false);
    onChange(src);
  };

  const initializeImage = () => {
    if (profileImageUrl === avatarDefaultImg) return;
    setIsImageDefault(true);
    setProfileImageUrl(avatarDefaultImg);
  };

  useEffect(() => {
    const fetchImages = async () => {
      const { imageUrls } = await fetchAsync();
      if (!imageUrls) return;
      setImages(imageUrls);
    };
    fetchImages();
  }, [fetchAsync]);

  return (
    <div css={SelectProfileImageStyle}>
      <div
        className={`profile-img-area ${isImageDefault ? "default" : ""}`}
        onClick={initializeImage}
      >
        <Avatar size="lg" imgSrc={profileImageUrl} />
      </div>
      <div className="select-profile-img-area">
        {fetchError && <p>이미지를 불러오는 데 실패했어요.. 😢</p>}
        <ul className="select-profile-img">
          {images?.slice(1).map((imgSrc, i) => (
            <Suspense
              fallback={
                <Skeleton
                  key={i}
                  width={avatarSkeletonSize}
                  height={avatarSkeletonSize}
                />
              }
            >
              <Avatar
                key={i}
                imgSrc={imgSrc}
                size={isMobile ? "sm" : "md"}
                onClick={changeProfileImageUrl}
              />
            </Suspense>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectProfileImage;

const SelectProfileImageStyle = css`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (min-width: ${BREAKPOINTS.md}px) {
    gap: 32px;
  }

  .profile-img-area {
    position: relative;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    flex-shrink: 0;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      background: url("/src/assets/images/ic-close-gray.svg") no-repeat center;
      background-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: 0.2s;
    }

    &:not(.default):hover:before {
      opacity: 1;
      visibility: visible;
    }
  }

  .select-profile-img-area p {
    font-size: var(--font-size-16);
    color: var(--gray-500);
    margin-bottom: 12px;
  }

  .select-profile-img {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    @media (min-width: ${BREAKPOINTS.md}px) {
      gap: 6px;
    }
  }
`;
