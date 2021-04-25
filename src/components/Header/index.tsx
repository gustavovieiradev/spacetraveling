import Link from 'next/link';
import commonStyles from '../../styles/common.module.scss';

import styles from './header.module.scss';

export default function Header(): any {
  return (
    <div className={commonStyles.container}>
      <Link href="/" passHref>
        <img src="/logo.svg" alt="logo" className={styles.logo} />
      </Link>
    </div>
  );
}
