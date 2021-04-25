import commonStyles from '../../styles/common.module.scss';

import styles from './header.module.scss';

export default function Header(): any {
  return (
    <div className={commonStyles.container}>
      <img src="/logo.svg" alt="logo" className={styles.logo} />
    </div>
  );
}
