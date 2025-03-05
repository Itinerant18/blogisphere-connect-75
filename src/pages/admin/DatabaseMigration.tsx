
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { migrateFromSupabaseToFirebase, migrateFromSupabaseToMongoDB } from '@/utils/databaseMigration';
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import Navbar from '@/components/Navbar';

const DatabaseMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('mongodb');

  const handleMigration = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      let migrationResult;
      
      if (selectedTab === 'firebase') {
        toast.info('Starting migration to Firebase...');
        migrationResult = await migrateFromSupabaseToFirebase();
      } else if (selectedTab === 'mongodb') {
        toast.info('Starting migration to MongoDB...');
        migrationResult = await migrateFromSupabaseToMongoDB();
      } else {
        throw new Error('Invalid database selection');
      }
      
      setResult(migrationResult);
      
      if (migrationResult.success) {
        toast.success(`Migration completed! Migrated ${migrationResult.migrated} items.`);
      } else {
        toast.error('Migration failed. See details for more information.');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error(`Migration failed: ${error.message}`);
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">Database Migration Tool</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Migrate from Supabase</CardTitle>
            <CardDescription>
              Migrate your blog data from Supabase to a different database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mongodb" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
                <TabsTrigger value="firebase">Firebase</TabsTrigger>
              </TabsList>
              <TabsContent value="mongodb" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">MongoDB Migration</h3>
                  </div>
                  <p>
                    Migrate your blog data from Supabase to MongoDB. This will create new documents in MongoDB
                    with the same data structure as your Supabase records.
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Make sure you have set up your MongoDB connection string in the .env file before proceeding.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
              <TabsContent value="firebase" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Firebase Migration</h3>
                  </div>
                  <p>
                    Migrate your blog data from Supabase to Firebase. This will create new documents in Firestore
                    with the same data structure as your Supabase records.
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Make sure you have set up your Firebase configuration in the .env file before proceeding.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleMigration} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Migrating...' : `Migrate to ${selectedTab === 'firebase' ? 'Firebase' : 'MongoDB'}`}
            </Button>
          </CardFooter>
        </Card>
        
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span>Migration Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Migration completed successfully.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Total Migrated</p>
                      <p className="text-2xl font-bold">{result.migrated}</p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold">{result.failed || 0}</p>
                    </div>
                  </div>
                  
                  {result.details && result.details.length > 0 && (
                    <div>
                      <Separator className="my-4" />
                      <h3 className="text-lg font-medium mb-2">Migration Details</h3>
                      <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {result.error || 'An unknown error occurred during migration.'}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatabaseMigration;
