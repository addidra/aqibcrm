import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ListingSchema } from "@/types/listing";
import type { Listing } from "@/types/listing";
import { useParams, useNavigate } from "react-router-dom";
import { Save, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const API_BASE = "http://localhost:4000/api/listings";

export default function CreateListingPage() {
    const [docId, setDocId] = useState<string | null>(null);
    const [isPublished, setIsPublished] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const form = useForm<Listing>({
        resolver: zodResolver(ListingSchema),
        defaultValues: {
            _id: id || undefined,
            title: "",
            description: "",
            price: 0,
            currency: "AED",
            propertyType: "apartment",
            purpose: "sale",
            sizeSqFt: 0,
            bedrooms: 0,
            bathrooms: 0,
            parkingSpots: 0,
            location: {
                emirate: "",
                city: "",
                street: "",
                buildingName: "",
                community: "",
                coordinates: { lat: 0, lng: 0 },
            },
            status: "draft",
            isPublished: false,
            amenities: [],
            developer: "",
            completionStatus: "ready",
            yearBuilt: new Date().getFullYear(),
            paymentPlan: { available: false },
            ownership: "freehold",
            agent: {
                name: "",
                phone: "",
                email: "",
                company: "",
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });

    const saveToServer = async (data: Listing) => {
        if (isLoadingInitial) return;

        try {
            const id = docId || data._id;

            const payload = {
                ...data,
                updatedAt: new Date().toISOString(),
            };
            delete payload._id;

            if (!id) {
                payload.createdAt = new Date().toISOString();
                const res = await axios.post(API_BASE, payload);
                setDocId(res.data._id);
                form.setValue("_id", res.data._id, { shouldDirty: false });
            } else {
                await axios.put(`${API_BASE}/${id}`, payload);
            }
            setLastSaved(new Date());
        } catch (error) {
            console.error("Autosave failed:", error);
        }
    };

    const debouncedSave = useCallback(
        debounce((values: Listing) => {
            saveToServer(values);
        }, 700),
        [docId]
    );

    useEffect(() => {
        if (!id) {
            setIsLoadingInitial(false);
            return;
        }

        const fetchListing = async () => {
            try {
                const res = await axios.get(`${API_BASE}/${id}`);
                const data: Listing = res.data;
                form.reset(data);
                setDocId(data._id ?? null);
                setIsPublished(data.isPublished || false);
            } catch (err) {
                console.error("Failed to load listing:", err);
            } finally {
                setIsLoadingInitial(false);
            }
        };

        fetchListing();
    }, [id]);

    useEffect(() => {
        if (isLoadingInitial) return;
        const subscription = form.watch((values) => {
            debouncedSave(values as Listing);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, isLoadingInitial]);

    const publishForm = async () => {
        const data = form.getValues();
        const id = docId || data._id;
        await axios.put(`${API_BASE}/${id}`, {
            isPublished: !isPublished,
            status: isPublished ? "draft" : "published",
            updatedAt: new Date().toISOString(),
        });
        setIsPublished(!isPublished);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            // size="icon"
                            onClick={() => navigate("/")}
                        >
                            <ArrowLeft className="h-5 w-5" color="white" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">
                                {id ? "Edit" : "Create"} Listing
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                {lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : "Changes auto-save"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant={isPublished ? "default" : "outline"} className="capitalize">
                            {isPublished ? (
                                <><CheckCircle className="h-3 w-3 mr-1" /> Published</>
                            ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Draft</>
                            )}
                        </Badge>
                        <Button onClick={publishForm} variant={isPublished ? "outline" : "default"}>
                            {isPublished ? "Unpublish" : "Publish Listing"}
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <form className="space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Essential property details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Title *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPublished}
                                                    placeholder="Luxury 2BR Apartment with Marina View"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isPublished}
                                                    placeholder="A premium 2-bedroom apartment located in Dubai Marina..."
                                                    rows={5}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="propertyType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Type *</FormLabel>
                                                <Select
                                                    disabled={isPublished}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-white">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent >
                                                        <SelectItem value="apartment">Apartment</SelectItem>
                                                        <SelectItem value="villa">Villa</SelectItem>
                                                        <SelectItem value="townhouse">Townhouse</SelectItem>
                                                        <SelectItem value="penthouse">Penthouse</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="purpose"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Purpose *</FormLabel>
                                                <Select
                                                    disabled={isPublished}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-white">
                                                            <SelectValue placeholder="Select purpose" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="sale">For Sale</SelectItem>
                                                        <SelectItem value="rent">For Rent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pricing & Dimensions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & Dimensions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price (AED) *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={isPublished}
                                                        placeholder="1850000"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sizeSqFt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Size (sq ft)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={isPublished}
                                                        placeholder="1380"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="parkingSpots"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Parking Spots</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={isPublished}
                                                        placeholder="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bedrooms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bedrooms</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={isPublished}
                                                        placeholder="2"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bathrooms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bathrooms</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={isPublished}
                                                        placeholder="3"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location.emirate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Emirate *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Dubai"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City / Area *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Dubai Marina"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location.buildingName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Building Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Marina Gate 1"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location.community"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Community</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Marina Gate"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="location.street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPublished}
                                                    placeholder="Al Marsa Street"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="location.coordinates.lat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Latitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        disabled={isPublished}
                                                        placeholder="25.085779"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="location.coordinates.lng"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Longitude</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="any"
                                                        disabled={isPublished}
                                                        placeholder="55.14545"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Property Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Property Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="developer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Developer</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Emaar Properties"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="yearBuilt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year Built</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        disabled={isPublished}
                                                        placeholder="2018"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="completionStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Completion Status</FormLabel>
                                                <Select
                                                    disabled={isPublished}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-white">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ready">Ready</SelectItem>
                                                        <SelectItem value="off-plan">Off-Plan</SelectItem>
                                                        <SelectItem value="under-construction">Under Construction</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="ownership"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ownership</FormLabel>
                                                <Select
                                                    disabled={isPublished}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="text-white">
                                                            <SelectValue placeholder="Select ownership" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="freehold">Freehold</SelectItem>
                                                        <SelectItem value="leasehold">Leasehold</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amenities</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isPublished}
                                                    placeholder="Gym, Swimming Pool, 24/7 Security (comma-separated)"
                                                    rows={3}
                                                    value={field.value?.join(", ") || ""}
                                                    onChange={(e) => {
                                                        const amenities = e.target.value
                                                            .split(",")
                                                            .map((a) => a.trim())
                                                            .filter(Boolean);
                                                        field.onChange(amenities);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Separate each amenity with a comma
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Agent Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Agent Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="agent.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Agent Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Aqib Mohammed"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="agent.company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isPublished}
                                                        placeholder="Prime Estates Real Estate"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="agent.phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        disabled={isPublished}
                                                        placeholder="+971501112233"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="agent.email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        disabled={isPublished}
                                                        placeholder="aqib@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between pt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                className="text-white hover:text-white"
                                onClick={() => navigate("/")}
                            >
                                Back to Listings
                            </Button>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Save className="h-4 w-4" />
                                <span>All changes are automatically saved</span>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}