import { Tab } from '@/interfaces/tabs';
import styles from '@/styles/modules/Tabs.module.scss';
import { useState } from 'react';

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  return (
    <div>
      <ul className={styles.tabs}>
        {tabs.map((t: Tab) => (
          <li
            role="tab"
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`${styles.tab} ${activeTab === t.id && styles.tabActive} bold`}>
            {t.text}
          </li>
        ))}
      </ul>

      <div className={styles.tabContent}>
        {tabs.map((t: Tab) => (
          <div
            key={t.id}
            className={`${styles.tabContentItem} ${t.id === activeTab ? styles.tabContentItemActive : ''}`}>
            {t.content()}
          </div>
        ))}
      </div>
    </div>
  );
}
