import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal, Filter, X, Eye, Edit, Delete, Trash } from "lucide-react";
import type { Listing } from "@/types/listing";
    
const Home = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        emirate: "",
        city: "",
        propertyType: "",
        status: "",
        purpose: "",
        minPrice: "",
        maxPrice: "",
        minBedrooms: "",
        maxBedrooms: "",
    });
    
    const navigate = useNavigate();
    
    const applyFilters = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:4000/api/listings", {
                params: filters,
            });
            setListings(res.data);
        } catch (err) {
            console.error("Failed to filter listings", err);
        } finally {
            setLoading(false);
        }
    };
    
    const resetFilters = () => {
        setFilters({
            emirate: "",
            city: "",
            propertyType: "",
            status: "",
            purpose: "",
            minPrice: "",
            maxPrice: "",
            minBedrooms: "",
            maxBedrooms: "",
        });
    };

    useEffect(() => {
        applyFilters();
    }, []);

    const hasActiveFilters = Object.values(filters).some(val => val !== "");

    return (
        <div className="max-w-7xl mx-auto py-10 px-5 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Property Listings</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your UAE property inventory
                    </p>
                </div>

                <Button onClick={() => navigate("/create")} size="lg">
                    + Add Listing
                </Button>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" color="white" />
                            <span className="text-white">Filters</span>
                            {hasActiveFilters && (
                                <Badge variant="success" className="ml-1 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                                    !
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-80 p-4 bg-background" align="start">
                        <DropdownMenuLabel className="text-base">Filter Listings</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <div className="space-y-4 py-2">
                            {/* Location Filters */}
                            <div className="space-y-2">
                                <Label htmlFor="emirate" className="text-xs font-medium text-foreground">Emirate</Label>
                                <Input
                                    id="emirate"
                                    placeholder="e.g. Dubai"
                                    value={filters.emirate}
                                    onChange={(e) => setFilters(f => ({ ...f, emirate: e.target.value }))}
                                    className="bg-background text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-xs font-medium text-foreground">City / Area</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g. Dubai Marina"
                                    value={filters.city}
                                    onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                                    className="bg-background text-foreground"
                                />
                            </div>

                            {/* Property Details */}
                            <div className="space-y-2">
                                <Label htmlFor="propertyType" className="text-xs font-medium text-foreground">Property Type</Label>
                                <Select 
                                    value={filters.propertyType} 
                                    onValueChange={(val) => setFilters(f => ({ ...f, propertyType: val }))}
                                >
                                    <SelectTrigger id="propertyType" className="bg-background text-white">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectItem value="apartment">Apartment</SelectItem>
                                        <SelectItem value="villa">Villa</SelectItem>
                                        <SelectItem value="townhouse">Townhouse</SelectItem>
                                        <SelectItem value="penthouse">Penthouse</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purpose" className="text-xs font-medium text-foreground">Purpose</Label>
                                <Select 
                                    value={filters.purpose} 
                                    onValueChange={(val) => setFilters(f => ({ ...f, purpose: val }))}
                                >
                                    <SelectTrigger id="purpose" className="bg-background text-white">
                                        <SelectValue placeholder="Select purpose" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectItem value="sale">Sale</SelectItem>
                                        <SelectItem value="rent">Rent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-medium text-foreground">Status</Label>
                                <Select 
                                    value={filters.status} 
                                    onValueChange={(val) => setFilters(f => ({ ...f, status: val }))}
                                >
                                    <SelectTrigger id="status" className="bg-background text-white">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground">Price Range (AED)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                                        className="bg-background text-foreground"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                                        className="bg-background text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Bedrooms Range */}
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-foreground">Bedrooms</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minBedrooms}
                                        onChange={(e) => setFilters(f => ({ ...f, minBedrooms: e.target.value }))}
                                        className="bg-background text-foreground"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxBedrooms}
                                        onChange={(e) => setFilters(f => ({ ...f, maxBedrooms: e.target.value }))}
                                        className="bg-background text-foreground"
                                    />
                                </div>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <Button 
                                size="sm" 
                                onClick={() => {
                                    applyFilters();
                                }} 
                                className="flex-1"
                            >
                                Apply Filters
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                    resetFilters();
                                    setTimeout(() => applyFilters(), 100);
                                }}
                                className="flex-1 text-white hover:text-white"
                            >
                                <X className="h-4 w-4 mr-1" color="white" />
                                Reset
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Active Filter Count */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{listings.length} results</span>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading properties...</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && listings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-white mb-4">
                        {hasActiveFilters ? "No properties match your filters" : "No listings found"}
                    </p>
                    {hasActiveFilters ? (
                        <Button variant="outline" onClick={() => {
                            resetFilters();
                            // setTimeout(() => applyFilters(), 100);
                            navigate(0);
                        }} className="text-white hover:text-white">
                            Clear Filters
                        </Button>
                    ) : (
                        <Button onClick={() => navigate("/create")} className="text-white">
                            + Create Your First Listing
                        </Button>
                    )}
                </div>
            )}

            {/* Listing Table */}
            {!loading && listings.length > 0 && (
                <div className="border rounded-lg overflow-hidden bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Property</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-center">Beds</TableHead>
                                <TableHead className="text-center">Baths</TableHead>
                                <TableHead className="text-right">Size (sqft)</TableHead>
                                <TableHead className="text-right">Price (AED)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        
                        <TableBody>
                            {listings.map((item) => (
                                <TableRow key={item._id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        <div className="space-y-1">
                                            <div 
                                                className="font-semibold cursor-pointer hover:underline"
                                                onClick={() => navigate(`/edit/${item._id}`)}
                                            >
                                                {item.title}
                                            </div>
                                            {item.location?.buildingName && (
                                                <div className="text-xs text-muted-foreground">
                                                    {item.location.buildingName}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <div className="text-sm">{item.location?.city}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.location?.emirate}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="success" className="capitalize">
                                            {item.propertyType}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {item.bedrooms || '-'}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {item.bathrooms || '-'}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {item.sizeSqFt?.toLocaleString() || '-'}
                                    </TableCell>

                                    <TableCell className="text-right font-semibold">
                                        {item.price?.toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={item.status === "published" ? "default" : "outline"}
                                            className="capitalize"
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => navigate(`/preview/${item._id}`)}
                                                className="h-8 px-2 hover:bg-accent"
                                            >
                                                <Eye className="h-4 w-4" color="white"/>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => navigate(`/edit/${item._id}`)}
                                                className="h-8 px-2"
                                            >
                                                <Trash className="h-4 w-4" color="white" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Results Summary */}
            {!loading && listings.length > 0 && (
                <div className="text-sm text-muted-foreground text-center">
                    Showing {listings.length} {listings.length === 1 ? 'property' : 'properties'}
                </div>
            )}
        </div>
    );
};

export default Home;