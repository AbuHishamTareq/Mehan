import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock,
    UserCheck,
    Star,
    Activity,
    ChefHat,
    Car,
    Home,
    Briefcase,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";

    const stats = [
        {
            title: "Total Bookings",
            value: "1,234",
            change: "+12%",
            icon: Calendar,
            color: "text-blue-600",
        },
        {
            title: "Active Staff",
            value: "89",
            change: "+5%",
            icon: Users,
            color: "text-green-600",
        },
        {
            title: "Revenue",
            value: "$45,678",
            change: "+18%",
            icon: DollarSign,
            color: "text-purple-600",
        },
        {
            title: "Satisfaction",
            value: "4.8/5",
            change: "+0.2",
            icon: Star,
            color: "text-yellow-600",
        },
    ];

    const services = [
        { name: "Housemaids", count: 145, icon: Home, color: "bg-blue-500" },
        { name: "Drivers", count: 89, icon: Car, color: "bg-green-500" },
        { name: "Chefs", count: 67, icon: ChefHat, color: "bg-purple-500" },
        { name: "Others", count: 43, icon: Briefcase, color: "bg-orange-500" },
    ];

    const recentBookings = [
        {
            id: "B001",
            service: "Housemaid",
            client: "Sarah Ahmed",
            status: "Active",
            time: "2 hours ago",
        },
        {
            id: "B002",
            service: "Driver",
            client: "Mohammed Ali",
            status: "Pending",
            time: "4 hours ago",
        },
        {
            id: "B003",
            service: "Chef",
            client: "Fatima Hassan",
            status: "Completed",
            time: "6 hours ago",
        },
        {
            id: "B004",
            service: "Housemaid",
            client: "Ahmed Omar",
            status: "Active",
            time: "8 hours ago",
        },
    ];

    return (
        <div className={`bg-gradient-card min-h-full ${font}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t("welcomeToDashboard")}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {t("dashboardSubtitle")}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card
                            key={stat.title}
                            className="hover:shadow-card transition-all duration-300 animate-scale-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-green-600 flex items-center mt-1">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            {stat.change}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-full bg-gray-100 ${stat.color}`}
                                    >
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Services Overview */}
                    <Card className="lg:col-span-2 animate-slide-in-right">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 mr-2" />
                                Services Overview
                            </CardTitle>
                            <CardDescription>
                                Current staff distribution across services
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {services.map((service, index) => (
                                    <div
                                        key={service.name}
                                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                        style={{
                                            animationDelay: `${index * 150}ms`,
                                        }}
                                    >
                                        <div
                                            className={`p-2 rounded-lg ${service.color} mr-3`}
                                        >
                                            <service.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {service.count}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {service.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 space-y-2">
                                <Button
                                    onClick={() => (
                                        <Navigate to={"/services"} />
                                    )}
                                    className="w-full bg-gradient-primary hover:shadow-primary transition-all duration-300"
                                >
                                    Manage Services
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card
                        className="animate-fade-in"
                        style={{ animationDelay: "300ms" }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Recent Bookings
                            </CardTitle>
                            <CardDescription>
                                Latest booking requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {booking.client}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {booking.service}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {booking.time}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                booking.status === "Active"
                                                    ? "default"
                                                    : booking.status ===
                                                      "Pending"
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                            className="text-xs"
                                        >
                                            {booking.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                            <Button
                                onClick={() => <Navigate to={"/bookings"} />}
                                variant="outline"
                                className="w-full mt-4 hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                View All Bookings
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card
                    className="mt-8 animate-fade-in"
                    style={{ animationDelay: "500ms" }}
                >
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Manage your SAAT CRM efficiently
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                                onClick={() => <Navigate to={"/staff"} />}
                                className="h-20 bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-300"
                            >
                                <UserCheck className="w-6 h-6" />
                                <span>Manage Staff</span>
                            </Button>
                            <Button
                                onClick={() => <Navigate to={"/bookings"} />}
                                className="h-20 bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-300"
                            >
                                <Calendar className="w-6 h-6" />
                                <span>New Booking</span>
                            </Button>
                            <Button
                                onClick={() => <Navigate to={"/services"} />}
                                className="h-20 bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center justify-center space-y-2 hover:scale-105 transition-all duration-300"
                            >
                                <Briefcase className="w-6 h-6" />
                                <span>Service Settings</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
