import Image from 'next/image';
import styled from 'styled-components';
import { font } from 'src/styles/mixins.style';
import HeroImage from 'public/images/hero.png';

const StyledSection = styled.section`
  padding: 150px 20px 20px 20px;
  width: 100%;
  background: linear-gradient(0deg, #fff, #eae6ff 100%);
  background-image: linear-gradient(0deg, rgb(255, 255, 255), rgb(234, 230, 255) 100%);
  overflow-x: hidden;
`;

const StyledWrapper = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1000px) {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

const StyledMemo = styled.div`
  margin-right: 50px;
  max-width: 45vw;
  width: 100%;

  h2 {
    ${({ theme }) => font({ size: '5rem', height: '5rem', color: theme.colors.$grey1, weight: 500 })}
  }

  p {
    ${({ theme }) => font({ size: '3rem', height: '4rem', color: theme.colors.$grey3 })}
  }

  @media (max-width: 1000px) {
    text-align: center;
    max-width: 85vw;
  }

  @media (max-width: 400px) {
    h2 {
      font-size: 3rem;
      line-height: 3rem;
    }

    p {
      font-size: 2rem;
      line-height: 2.5rem;
    }
  }
`;

const ImageWrap = styled.span`
  @media (max-width: 1000px) {
    display: none;
  }
`;

const SectionHero = () => {
  return (
    <StyledSection>
      <StyledWrapper>
        <StyledMemo>
          <h2>Thullo helps teams move work forward.</h2>
          <p>
            Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way
            your team works is unique — accomplish it all with Thullo.
          </p>
        </StyledMemo>
        <ImageWrap>
          <Image src={HeroImage} alt="hero" layout="fixed" width={439} height={568} />
        </ImageWrap>
      </StyledWrapper>
    </StyledSection>
  );
};

export default SectionHero;
