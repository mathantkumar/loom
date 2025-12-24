
import { Card } from '../components/ui/Card';

export function HelpPage() {
    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "How do I escalate an incident?", a: "Use the 'Escalate' button in the Incident Detail page to page the next level on-call." },
                            { q: "Can I edit an incident summary?", a: "Yes, click the 'What Happened?' action to generate a draft, then accept or edit it." },
                            { q: "Where can I find the API docs?", a: "API documentation is available at /documentation/api." },
                        ].map((item, i) => (
                            <Card key={i} className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                                <p className="text-sm text-gray-600">{item.a}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Support</h2>
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <p className="text-indigo-900 font-medium mb-2">Need urgent help with the platform?</p>
                        <p className="text-indigo-700 text-sm mb-4">
                            If Sentinel itself is down or behaving incorrectly, reach out to the Platform Infrastructure team.
                        </p>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                            Contact Platform Team
                        </button>
                    </div>
                </section>
            </div>
        </div>

    );
}
