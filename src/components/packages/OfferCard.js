"use client";
import { useTranslation } from "react-i18next";
import { IoMdPerson } from "react-icons/io";
import { FaClock, FaWhatsapp } from "react-icons/fa";
import { BiCalendarCheck } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import styled from "styled-components";

import { urlFor } from "@/services/sanity";

// Constants
const WHATSAPP_NUMBER = "1234567890";
const CARD_HEIGHT = 470;
const CONTENT_HEIGHT = 223;
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// Styled Components
const Card = styled.div`
  max-width: 20rem;
  width: 100%;
  margin-bottom: 1.25rem;
  height: ${CARD_HEIGHT}px;
  background-color: white;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  @media (min-width: 768px) {
    max-width: 20rem;
  }

  @media (min-width: 1024px) {
    margin-top: 0;
  }

  @media (max-width: 1023px) {
    margin-top: 1.25rem;
  }
`;

const BestSaleBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background-color: #10b981;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  z-index: 10;
`;

const MapBadge = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background-color: rgba(243, 244, 246, 0.7);
  color: black;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(12px);
  z-index: 10;
`;

const ImageContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const NoImageContainer = styled.div`
  width: 100%;
  height: 65%;
  background-color: #e5e7eb;
  border-radius: 2rem 2rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 65%;
  object-fit: cover;
  border-radius: 2rem 2rem 0 0;
  max-width: 100%;
`;

const ContentContainer = styled.div`
  padding: 2rem 1.25rem 1.25rem;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 0 0 2rem 2rem;
  height: ${CONTENT_HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Overview = styled.p`
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const InfoContainer = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;

  span {
    font-weight: 600;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .price-main {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    line-height: 1;
  }

  .currency {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
  }

  .price-unit {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  .no-price {
    display: flex;
    align-items: center;
  }

  .price-unavailable {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    font-style: italic;
    padding: 0.25rem 0.5rem;
    background-color: #f9fafb;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }

  /* RTL Support */
  &[dir="rtl"] {
    direction: rtl;

    .price-main {
      flex-direction: row-reverse;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .price {
      font-size: 1.125rem;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BookButton = styled.button`
  padding: 0.5rem 1rem;
  color: black;
  background-color: #f2f4f6;
  border: 1px solid #e4e6e8;
  border-radius: 1.5rem;
  font-weight: 700;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const WhatsAppButton = styled.button`
  padding: 0.5rem 0.75rem;
  color: white;
  background-color: #10b981;
  border: none;
  border-radius: 1.5rem;
  font-weight: 700;
  font-size: 0.8125rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #059669;
  }
`;

const OfferCard = ({ offer }) => {
  const { i18n, t } = useTranslation();
  const lan = i18n.language;

  // Event handlers
  const handleWhatsAppClick = () => {
    const message = `${t(
      "common.whatsappMessage",
      "مرحبًا، أرغب في حجز العرض التالي:"
    )} ${offer?.title || t("common.thisPackage", "this package")}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card aria-label={t("packages.offer_card", "Offer Card")}>
      <BadgeSection offer={offer} t={t} />
      <PosterSection offer={offer} lan={lan} t={t} />
      <ContentSection
        offer={offer}
        lan={lan}
        t={t}
        onWhatsAppClick={handleWhatsAppClick}
      />
    </Card>
  );
};

// Badge Section Component
const BadgeSection = ({ offer, t }) => (
  <>
    {offer?.most && (
      <BestSaleBadge>{t("packages.bestSale", "Best Sale")}</BestSaleBadge>
    )}
    <MapBadge>{offer?.map}</MapBadge>
  </>
);

// Poster Section Component
const PosterSection = ({ offer, lan, t }) => {
  const altText = offer?.title || t("packages.hero.offerImage", "Offer Image");

  if (!offer?.poster) {
    return (
      <NoImageContainer>
        <span>{t("packages.no_image", "No image available")}</span>
      </NoImageContainer>
    );
  }

  return (
    <ImageContainer>
      <StyledImage
        src={urlFor(offer.poster).url()}
        alt={altText}
        width={320}
        height={290}
        loading="lazy"
        quality={40}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      />
    </ImageContainer>
  );
};

// Content Section Component
const ContentSection = ({ offer, lan, t, onWhatsAppClick }) => (
  <ContentContainer>
    <OfferTitle title={offer?.title} t={t} />
    <OfferOverview overview={offer?.overview} t={t} />
    <OfferInfo offer={offer} t={t} />
    <ActionsSection offer={offer} t={t} onWhatsAppClick={onWhatsAppClick} />
  </ContentContainer>
);

// Individual Content Components
const OfferTitle = ({ title, t }) => (
  <Title>{title || t("packages.untitled", "Untitled")}</Title>
);

const OfferOverview = ({ overview, t }) => (
  <Overview>
    {overview || t("packages.no_overview", "No overview available.")}
  </Overview>
);

const OfferInfo = ({ offer, t }) => (
  <InfoContainer>
    <DurationInfo duration={offer?.duration} t={t} />
    <GuestInfo numberOfGuests={offer?.numberOfGuests} t={t} />
  </InfoContainer>
);

const DurationInfo = ({ duration, t }) => (
  <InfoItem>
    <FaClock />
    <span>{duration || "0"}</span>
    <span>
      {t("common.days", "days")} / {duration - 1 || "0"}
      {t("common.nights", "nights")}
    </span>
  </InfoItem>
);

const GuestInfo = ({ numberOfGuests, t }) => {
  const getGuestText = (count) => {
    if (!count) return t("common.guests", "Guests");

    if (count === 1) {
      return t("common.single", "فردي");
    } else if (count === 2) {
      return t("common.double", "زوجي");
    } else {
      return `${count} ${t("common.guests", "Guests")}`;
    }
  };

  return (
    <InfoItem>
      <IoMdPerson />
      {getGuestText(numberOfGuests)}
    </InfoItem>
  );
};

const ActionsSection = ({ offer, t, onWhatsAppClick }) => (
  <ActionsContainer>
    <PriceDisplay price={offer?.price} t={t} />
    <ActionButtons offer={offer} t={t} onWhatsAppClick={onWhatsAppClick} />
  </ActionsContainer>
);

const PriceDisplay = ({ price, t }) => {
  // Format price with proper number formatting
  const formatPrice = (value) => {
    if (!value || isNaN(value)) return null;
    const numValue = parseFloat(value);
    return new Intl.NumberFormat("en-US").format(numValue);
  };

  const formattedPrice = formatPrice(price);
  const hasValidPrice = formattedPrice !== null;

  return (
    <PriceContainer
      role="region"
      aria-label={t("common.priceInfo", "Price Information")}
    >
      {hasValidPrice ? (
        <>
          <div className="">
            <span
              className="price"
              aria-label={`${formattedPrice} ${t("common.currency", "SAR")}`}
            >
              {formattedPrice}
            </span>
            <span className="currency">{t("common.currency", "SAR")}</span>
          </div>
          <span className="price-unit">
            /{t("common.perPerson", "per person")}
          </span>
        </>
      ) : (
        <div className="no-price">
          <span className="price-unavailable">
            {t("packages.price_on_request", "Price on request")}
          </span>
        </div>
      )}
    </PriceContainer>
  );
};

const ActionButtons = ({ offer, t, onWhatsAppClick }) => (
  <ButtonContainer>
    <Link href={`/package/${offer?.slug?.current || ""}`}>
      <BookButton aria-label={t("common.book", "Book Now")}>
        <BiCalendarCheck />
        {t("common.book", "Book Now")}
      </BookButton>
    </Link>

    <WhatsAppButton
      aria-label={t("common.whatsapp", "Contact via WhatsApp")}
      onClick={onWhatsAppClick}
    >
      <FaWhatsapp />
    </WhatsAppButton>
  </ButtonContainer>
);

// PropTypes
const offerShape = PropTypes.shape({
  most: PropTypes.bool,
  map: PropTypes.string,
  poster: PropTypes.any,
  title: PropTypes.string,
  overview: PropTypes.string,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nights: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  numberOfGuests: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  slug: PropTypes.shape({
    current: PropTypes.string,
  }),
  id: PropTypes.any,
});

OfferCard.propTypes = {
  offer: offerShape.isRequired,
};

BadgeSection.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
};

PosterSection.propTypes = {
  offer: offerShape.isRequired,
  lan: PropTypes.string,
  t: PropTypes.func.isRequired,
};

ContentSection.propTypes = {
  offer: offerShape.isRequired,
  lan: PropTypes.string,
  t: PropTypes.func.isRequired,
  onWhatsAppClick: PropTypes.func.isRequired,
};

OfferTitle.propTypes = {
  title: PropTypes.string,
  t: PropTypes.func.isRequired,
};

OfferOverview.propTypes = {
  overview: PropTypes.string,
  t: PropTypes.func.isRequired,
};

OfferInfo.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
};

DurationInfo.propTypes = {
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

GuestInfo.propTypes = {
  numberOfGuests: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

ActionsSection.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
  onWhatsAppClick: PropTypes.func.isRequired,
};

PriceDisplay.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func.isRequired,
};

ActionButtons.propTypes = {
  offer: offerShape.isRequired,
  t: PropTypes.func.isRequired,
  onWhatsAppClick: PropTypes.func.isRequired,
};

export default OfferCard;
