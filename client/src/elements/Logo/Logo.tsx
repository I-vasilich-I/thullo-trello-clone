import Link from 'next/link';
import Image from 'next/image';
import { LINKS } from 'src/constants';
import LogoImg from 'public/images/Logo.svg';

const Logo = () => {
  return (
    <Link href={LINKS.HOME.href}>
      <a>
        <Image src={LogoImg} alt="logo" width={98} height={29} />
      </a>
    </Link>
  );
};

export default Logo;
