import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocLayout } from '../components/docs/DocLayout';
import { DOCS } from '../components/docs/docData';

export const DocumentationPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sectionParam = searchParams.get('section');

    // Default to first section if none specified or invalid
    const initialSectionId = sectionParam && DOCS.find(d => d.id === sectionParam)
        ? sectionParam
        : DOCS[0].id;

    const [activeSectionId, setActiveSectionId] = useState(initialSectionId);

    // Update URL when section changes
    const handleSectionChange = (id: string) => {
        setActiveSectionId(id);
        setSearchParams({ section: id });
    };

    // Sync state if URL changes externally (e.g. back button)
    useEffect(() => {
        if (sectionParam && sectionParam !== activeSectionId) {
            const exists = DOCS.find(d => d.id === sectionParam);
            if (exists) setActiveSectionId(sectionParam);
        }
    }, [sectionParam, activeSectionId]);

    const activeDoc = DOCS.find(doc => doc.id === activeSectionId) || DOCS[0];

    return (
        <DocLayout activeSectionId={activeSectionId} onSectionChange={handleSectionChange}>
            <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
                    <span>Docs</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{activeDoc.category}</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-blue-600">{activeDoc.title}</span>
                </div>

                {/* Content */}
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                    {activeDoc.content}
                </div>

                {/* Footer Navigation (Next/Prev) */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between">
                    {(() => {
                        const index = DOCS.findIndex(d => d.id === activeDoc.id);
                        const prev = DOCS[index - 1];
                        const next = DOCS[index + 1];
                        return (
                            <>
                                {prev ? (
                                    <button
                                        onClick={() => handleSectionChange(prev.id)}
                                        className="text-left group"
                                    >
                                        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Previous</div>
                                        <div className="text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                                            ← {prev.title}
                                        </div>
                                    </button>
                                ) : <div />}

                                {next ? (
                                    <button
                                        onClick={() => handleSectionChange(next.id)}
                                        className="text-right group"
                                    >
                                        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Next</div>
                                        <div className="text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                                            {next.title} →
                                        </div>
                                    </button>
                                ) : <div />}
                            </>
                        );
                    })()}
                </div>
            </div>
        </DocLayout>
    );
};
