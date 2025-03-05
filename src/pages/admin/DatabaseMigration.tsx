
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { backupSupabaseData, restoreFromBackup } from '@/utils/databaseMigration';
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Database } from "lucide-react";
import Navbar from '@/components/Navbar';

const DatabaseMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('backup');

  const handleOperation = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      let operationResult;
      
      if (selectedTab === 'backup') {
        toast.info('Starting data backup...');
        operationResult = await backupSupabaseData();
      } else if (selectedTab === 'restore') {
        toast.info('Starting data restoration...');
        operationResult = await restoreFromBackup();
      } else {
        throw new Error('Invalid operation selection');
      }
      
      setResult(operationResult);
      
      if (operationResult.success) {
        toast.success(`Operation completed! ${selectedTab === 'backup' ? 'Backed up' : 'Restored'} ${operationResult.backed_up || operationResult.restored || 0} items.`);
      } else {
        toast.error('Operation failed. See details for more information.');
      }
    } catch (error) {
      console.error('Operation error:', error);
      toast.error(`Operation failed: ${error.message}`);
      setResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">Database Operations</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Supabase Data Operations</CardTitle>
            <CardDescription>
              Backup or restore your blog data in Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">
                  {selectedTab === 'backup' ? 'Backup Data' : 'Restore Data'}
                </h3>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant={selectedTab === 'backup' ? 'default' : 'outline'} 
                  onClick={() => setSelectedTab('backup')}
                >
                  Backup
                </Button>
                <Button 
                  variant={selectedTab === 'restore' ? 'default' : 'outline'} 
                  onClick={() => setSelectedTab('restore')}
                >
                  Restore
                </Button>
              </div>
              <p>
                {selectedTab === 'backup' 
                  ? 'Create a backup of your Supabase blogs data in your browser\'s local storage.'
                  : 'Restore your backed up blog data to Supabase.'
                }
              </p>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  {selectedTab === 'backup'
                    ? 'This operation will overwrite any existing backup in your browser\'s local storage.'
                    : 'This operation will create new blog posts. It will not overwrite existing posts.'
                  }
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleOperation} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : selectedTab === 'backup' ? 'Backup Data' : 'Restore Data'}
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
                <span>Operation Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Operation completed successfully.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">
                        {selectedTab === 'backup' ? 'Backed Up' : 'Restored'}
                      </p>
                      <p className="text-2xl font-bold">
                        {selectedTab === 'backup' ? result.backed_up : result.restored || 0}
                      </p>
                    </div>
                    <div className="border rounded-md p-4">
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold">{result.failed || 0}</p>
                    </div>
                  </div>
                  
                  {result.details && result.details.length > 0 && (
                    <div>
                      <Separator className="my-4" />
                      <h3 className="text-lg font-medium mb-2">Operation Details</h3>
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
                      {result.error || 'An unknown error occurred during the operation.'}
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
