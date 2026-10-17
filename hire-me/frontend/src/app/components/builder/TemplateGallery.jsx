'use client';

import { useState } from 'react';
import { listCategories, listTemplatesByCategory } from '@/resume/templates/registry';
import TempleteCard from '../TempleteCard';
import { Button } from '../Button';
import FilterToggle from '../home/FilterToggle';

export default function TemplateGallery() {
  const [category, setCategory] = useState('All');

  console.log(category)

  return (
    <section className="flex flex-col gap-6">
      <div role="tablist" aria-label="Template categories" className="flex flex-wrap gap-2">
        {['All', ...listCategories()].map((name) => (
          <>
          
          <FilterToggle key={name}
            role="tab"
            active= {category === name}
            aria-selected={category === name}
            onClick={() => setCategory(name)} >{name}</FilterToggle></>
        ))}
      </div>

      <div className="flex flex-wrap gap-6">
        {listTemplatesByCategory(category).map((template) => (
          <TempleteCard key={template.id} template={template} />
        ))}
      </div>
      {/* Buttons */}
        <div className="flex items-center gap-space-0 max-sm:w-full max-sm:justify-between sm:gap-13 ">
          <Button
            iconOnly={true}
            icon="fi fi-rr-arrow-small-left"
            aria-label="Resume templetes left toggle button"
          />
          <span className="text-[18px]">
            2 <sub className="text-caption">{category.length || "/10"}</sub>
          </span>
          <Button
            iconOnly={true}
            icon="fi fi-rr-arrow-small-right"
            aria-label="Resume templetes right toggle button"
          />
        </div>
    </section>
  );
}