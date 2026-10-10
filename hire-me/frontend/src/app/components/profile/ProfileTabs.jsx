"use client";

import React, { useId, useState } from "react";
import ProfileNavbar from "./ProfileNav";

/* -------------------------------------------------------------------------- */
/*  ProfileTabs                                                                */
/*                                                                             */
/*  Page ta Server Component, tai tab er state ekhane (Client Component).      */
/*  Server theke render kora JSX `content` hishebe pass kora jay, tai data     */
/*  fetching server-e-i thakbe.                                                */
/*                                                                             */
/*  <ProfileTabs tabs={[{ key: "personal", label: "Personal", content: <A/> }]} /> */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} ProfileTab
 * @property {string} key - Unique key (e.g. "personal")
 * @property {string} label - Tab e ja dekhabe
 * @property {React.ReactNode} content - Ei tab er panel e ja render hobe
 *
 * @typedef {Object} ProfileTabsProps
 * @property {ProfileTab[]} tabs - Tab list
 * @property {string} [defaultTab] - Shuru te konta open thakbe (default: prothom tab)
 */

/** @param {ProfileTabsProps} props */
const ProfileTabs = ({ tabs = [], defaultTab }) => {
  const idPrefix = useId();
  const [activeKey, setActiveKey] = useState(defaultTab ?? tabs[0]?.key);

  return (
    <div className="space-y-6">
      <ProfileNavbar
        items={tabs}
        activeKey={activeKey}
        onChange={setActiveKey}
        idPrefix={idPrefix}
      />

      {/* Shob panel render thake, shudhu inactive gulo hidden — tai FieldDropdown er open/close state hariye jay na */}
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${idPrefix}-panel-${tab.key}`}
          aria-labelledby={`${idPrefix}-tab-${tab.key}`}
          hidden={tab.key !== activeKey}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs;
