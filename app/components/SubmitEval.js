'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function EvaluationForm({ params }) {
    const { id } = params;
    const { data: session } = useSession();
    const router = useRouter();

    const [ratings, setRatings] = useState({});
    const [selectedMembers, setSelectedMembers] = useState(5); // Default to 5 members

    const components = [
        {
            title: 'Contributes to Team Project',
            descriptions: [
                'Participates actively and accepts a fair share of the group work',
                'Works skillfully on assigned tasks and completes them on time',
                'Gives timely, constructive feedback to team members, in the appropriate format'
            ]
        },
        {
            title: 'Facilitates Contribution of Others',
            descriptions: [
                'Communicated actively and constructively',
                'Encourages all perspective be considered and acknowledges contributions of others',
                'Constructively builds on contributions of others and integrates own work with work of others'
            ]
        },
        {
            title: 'Planning & Management',
            descriptions: [
                'Takes on an appropriate role in group',
                'Clarifies goals and plans the project',
                'Reports to team on progress'
            ]
        },
        {
            title: 'Fosters a Team Climate',
            descriptions: [
                'Ensures consistency between words, tones, facial expression, and body language',
                'Express positivity and optimism about team members and project'
            ]
        },
        {
            title: 'Manages Potential Conflict',
            descriptions: [
                'Displays appropriate assertiveness; neither dominating, submissive, nor passive aggressive',
                'Contributes appropriately to healthy debate',
                'Responds to and manages direct/indirect conflict constructively and effectively'
            ]
        }
    ];

    const handleInputChange = (e, component, descriptionIndex, memberIndex) => {
        const value = e.target.value;
        setRatings((prev) => ({
            ...prev,
            [component]: {
                ...prev[component],
                [`${descriptionIndex}-${memberIndex}`]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch(`/api/evaluations/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ratings }),
        });

        router.push('/');
    };

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Submit Evaluation for {session?.user?.name}</h1>

            {/* Key */}
            <div className="mb-4 border p-4 bg-gray-100">
                <strong>Key:</strong>
                <ul>
                    <li>0 = Never</li>
                    <li>1 = Sometimes</li>
                    <li>2 = Usually</li>
                    <li>3 = Regularly</li>
                    <li>4 = Always</li>
                </ul>
            </div>

            {/* Number of Members */}
            <div className="mb-4">
                <label htmlFor="members" className="block font-bold mb-2">Select Number of Team Members:</label>
                <input
                    type="number"
                    id="members"
                    value={selectedMembers}
                    min={1}
                    max={10}
                    onChange={(e) => setSelectedMembers(Number(e.target.value))}
                    className="border rounded p-2 w-full"
                />
            </div>

            {/* Evaluation Table */}
            <form onSubmit={handleSubmit}>
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Component</th>
                            <th className="border p-2">Description</th>
                            {Array.from({ length: selectedMembers }).map((_, i) => (
                                <th key={i} className="border p-2 text-center">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        placeholder={`Member ${i + 1}`}
                                        className="w-20 text-center border rounded"
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {components.map((component, componentIdx) => (
                            <>
                                {component.descriptions.map((desc, descIdx) => (
                                    <tr key={`${componentIdx}-${descIdx}`} className="border-t">
                                        {descIdx === 0 ? (
                                            <td
                                                rowSpan={component.descriptions.length}
                                                className="border p-2 font-semibold align-top bg-gray-100"
                                            >
                                                {component.title}
                                            </td>
                                        ) : null}
                                        <td className="border p-2">{desc}</td>
                                        {Array.from({ length: selectedMembers }).map((_, memberIdx) => (
                                            <td key={`${descIdx}-${memberIdx}`} className="border p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="4"
                                                    value={
                                                        ratings[component.title]?.[`${descIdx}-${memberIdx}`] || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(e, component.title, descIdx, memberIdx)
                                                    }
                                                    className="border rounded p-1 w-full text-center"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </>
                        ))}

                        {/* Overall Row */}
                        <tr className="border-t bg-gray-100">
                            <td colSpan={2} className="border p-2 font-bold">Overall</td>
                            {Array.from({ length: selectedMembers }).map((_, i) => (
                                <td key={`overall-${i}`} className="border p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="4"
                                        value={
                                            ratings['Overall']?.[`0-${i}`] || ''
                                        }
                                        onChange={(e) =>
                                            handleInputChange(e, 'Overall', 0, i)
                                        }
                                        className="border rounded p-1 w-full text-center"
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>

                {/* Submit Button */}
                <div className="mt-4 text-right">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
