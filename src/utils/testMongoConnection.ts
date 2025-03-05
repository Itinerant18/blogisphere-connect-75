
import { toast } from "sonner";
import { clientPromise, checkMongoDBConnection } from "@/integrations/mongodb/client";

export const testMongoConnection = async () => {
  try {
    const client = await clientPromise;
    if (!client) {
      toast.error("Could not connect to MongoDB");
      return false;
    }

    const connectionStatus = await checkMongoDBConnection();
    if (connectionStatus.success) {
      toast.success(connectionStatus.message);
      console.log("MongoDB connection successful:", connectionStatus);
      return true;
    } else {
      toast.error(connectionStatus.message);
      console.error("MongoDB connection failed:", connectionStatus);
      return false;
    }
  } catch (error) {
    console.error("Error testing MongoDB connection:", error);
    toast.error("Error connecting to MongoDB");
    return false;
  }
};

export default testMongoConnection;
