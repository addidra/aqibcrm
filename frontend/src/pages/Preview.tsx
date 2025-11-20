import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import type { Listing } from "@/types/listing";
import { useEffect, useState } from "react";
import { 
    MapPin, 
    Bed, 
    Bath, 
    Square, 
    Car, 
    Calendar,
    User,
    Phone,
    Mail,
    Building2,
    CheckCircle2,
    Clock,
    CreditCard,
    Shield
} from "lucide-react";

export default function Preview() {
    const {id} = useParams<{id: string}>();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/listings/${id}`);
                const data = await res.json();
                setListing(data);
            } catch (error) {
                console.error("Failed to fetch listing:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchListing();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Listing not found</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Hero Section */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex gap-2 mb-3">
                                <Badge variant="outline" className="text-xs font-semibold">
                                    {listing.propertyType}
                                </Badge>
                                <Badge variant="outline" className="text-xs font-semibold">
                                    {listing.purpose}
                                </Badge>
                                <Badge 
                                    variant={listing?.isPublished ? "default" : "success"}
                                    className="text-xs font-semibold"
                                >
                                    {listing.status}
                                </Badge>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                {listing.title}
                            </h1>
                            <p className="text-lg text-gray-600 max-w-3xl">
                                {listing.description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mt-6">
                        <span className="text-5xl font-bold text-indigo-600">
                            {listing.currency} {listing.price.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {listing.location.community}, {listing.location.city}, {listing.location.emirate}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Features */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Key Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <Square className="w-8 h-8 text-indigo-600 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900">{listing.sizeSqFt}</span>
                                    <span className="text-sm text-gray-500">sq ft</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <Bed className="w-8 h-8 text-indigo-600 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900">{listing.bedrooms}</span>
                                    <span className="text-sm text-gray-500">Bedrooms</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <Bath className="w-8 h-8 text-indigo-600 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900">{listing.bathrooms}</span>
                                    <span className="text-sm text-gray-500">Bathrooms</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <Car className="w-8 h-8 text-indigo-600 mb-2" />
                                    <span className="text-2xl font-bold text-gray-900">{listing.parkingSpots}</span>
                                    <span className="text-sm text-gray-500">Parking</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Property Details */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl">Property Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Ownership" value={listing?.ownership ?? ""} />
                                <DetailItem label="Developer" value={listing?.developer ?? ""} />
                                <DetailItem label="Completion" value={listing?.completionStatus ?? ""} />
                                <DetailItem label="Year Built" value={listing?.yearBuilt ?? ""} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Details */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <DetailItem label="City" value={listing?.location?.city} />
                            <DetailItem label="Emirate" value={listing?.location?.emirate} />
                            <DetailItem 
                                label="Coordinates" 
                                value={`${listing?.location?.coordinates.lat}, ${listing?.location?.coordinates.lng}`} 
                            />
                        </CardContent>
                    </Card>

                    {/* Amenities */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Amenities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {listing.amenities?.map((amenity, i) => (
                                    <Badge 
                                        key={i} 
                                        variant="success"
                                        className="px-3 py-1 text-sm"
                                    >
                                        {amenity}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Agent Info */}
                    <Card className="shadow-md bg-gradient-to-br from-gray-50 to-gray-100">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Contact Agent
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-lg font-bold text-gray-900">
                                    {listing?.agent?.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {listing?.agent?.company}
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <a href={`tel:${listing?.agent?.phone}`} className="text-indigo-600 hover:underline">
                                        {listing?.agent?.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <a href={`mailto:${listing?.agent?.email}`} className="text-indigo-600 hover:underline">
                                        {listing?.agent?.email}
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Plan */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Payment Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {listing.paymentPlan?.available ? (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">
                                            Available
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            Not Available
                                        </span>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Listing Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Created</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(listing.createdAt ?? "").toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-gray-500 mb-1">Last Updated</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(listing.updatedAt ?? "").toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="space-y-1">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-900 capitalize">{value}</p>
        </div>
    );
}