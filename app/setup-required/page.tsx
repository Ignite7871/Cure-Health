import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database, Play } from "lucide-react"
import Link from "next/link"

export default function SetupRequiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Database Setup Required</CardTitle>
          <CardDescription className="text-gray-600">
            The healthcare assistant database needs to be initialized before you can create an account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Setup Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
              <li>Navigate to the Scripts section in your project</li>
              <li>
                Run the database setup script:{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">01-create-tables.sql</code>
              </li>
              <li>
                Run the sample data script:{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">02-seed-sample-data.sql</code>
              </li>
              <li>Return to this page and try signing up again</li>
            </ol>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What these scripts do:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Create user profiles and medical history tables</li>
              <li>Set up symptom assessment and AI analysis storage</li>
              <li>Configure security policies for data protection</li>
              <li>Add sample medical conditions and symptoms</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/auth/sign-up">
                <Play className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
