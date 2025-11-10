"use client";

import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { 
  Globe, 
  RefreshCw, 
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export interface Domain {
  domain: string;
  owner: { github: string };
  record: Record<string, string>;
  proxy?: boolean;
}

export interface DomainPortfolioProps {
  domains: Domain[];
  domainsLoading: boolean;
  domainsError: string;
  activeMap: Record<string, boolean>;
  refreshing: boolean;
  lastRefresh: Date | null;
  onRefresh: () => void;
  onEdit: (domain: Domain) => void;
  onDelete: (domain: Domain) => void;
}

export function DomainPortfolio({
  domains,
  domainsLoading,
  domainsError,
  activeMap,
  refreshing,
  lastRefresh,
  onRefresh,
  onEdit,
  onDelete
}: DomainPortfolioProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Your Subdomains
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your active subdomains and their configurations
              {lastRefresh && (
                <span className="ml-2 text-xs text-gray-500">
                  • Synced {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={onRefresh}
              disabled={refreshing}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Syncing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {domainsError && (
            <div className="text-red-400 text-sm">{domainsError}</div>
          )}
          {domainsLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Loading your subdomains...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">Ready to go live?</h3>
                  <p className="text-sm mb-4">Create your first subdomain to get started with is-a.software</p>
                  <Button asChild className="bg-blue-400 hover:bg-blue-300 text-black border-0 shadow-none transition-colors">
                    <Link href="/dashboard/subdomains/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create My First Domain
                    </Link>
                  </Button>
                </div>
              )}
              {domains.map((d) => {
                const targetType = Object.keys(d.record || {})[0];
                const targetValue = targetType ? d.record[targetType] : '';
                const hostname = `${d.domain}.is-a.software`;
                const isActive = activeMap[hostname];

                return (
                  <Card key={d.domain} className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] hover:border-[#555555] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.04)]">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{hostname}</h4>
                            <p className="text-gray-400 text-sm">
                              {targetType && targetValue ? (
                                <div className="flex items-center gap-2 min-w-0">
                                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 flex-shrink-0">
                                    {targetType}
                                  </Badge>
                                  <span className="font-mono text-xs text-gray-300 truncate overflow-hidden" title={targetValue}>
                                    {targetValue}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-500">No DNS records</span>
                              )}
                            </p>
                          </div>
                          {/* <div className="flex items-center gap-1 ml-2">
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                            <span className="text-xs text-gray-400">{isActive ? 'Active' : 'Inactive'}</span>
                          </div> */}
                        </div>

                        {d.owner?.github && (
                          <div className="flex items-center gap-2">
                            <Image
                              src={`https://avatars.githubusercontent.com/${d.owner.github}?s=16`}
                              alt={d.owner.github}
                              width={16}
                              height={16}
                              className="rounded-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/fallback-avatar.png';
                              }}
                            />
                            <span className="text-xs text-gray-500">@{d.owner.github}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(d)}
                            className="flex-1 h-8 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(d)}
                            className="h-8 text-xs border-red-800 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="h-8 text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <a href={`https://${hostname}`} target="_blank" rel="noopener noreferrer">
                              Visit
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}