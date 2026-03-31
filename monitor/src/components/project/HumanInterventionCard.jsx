import React from 'react'
import { AlertTriangle, User, UserCheck, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function HumanInterventionCard({
  issues,
  openIssueModal,
  setCreateIssueModal,
  isWriteMode,
}) {
  // Human intervention issues: created by human OR assigned to human
  const humanIssues = issues.filter(i =>
    i.creator === 'human' || i.assignee === 'human' || i.creator === 'chat'
  )
  const openIssues = humanIssues.filter(i => i.status === 'open')
  const closedIssues = humanIssues.filter(i => i.status !== 'open')

  // Split into: from human (human created) and to human (assigned to human)
  const fromHuman = openIssues.filter(i => i.creator === 'human' || i.creator === 'chat')
  const toHuman = openIssues.filter(i => i.assignee === 'human' && i.creator !== 'human' && i.creator !== 'chat')

  return (
    <Card className="flex flex-col max-h-[500px]">
      <CardHeader className="shrink-0 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Human Intervention
            {openIssues.length > 0 && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                {openIssues.length}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden pt-0">
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Needs your attention — agents asking for help */}
          {toHuman.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ArrowDown className="w-3 h-3 text-red-500" />
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Needs Your Attention</span>
              </div>
              {toHuman.map(issue => (
                <IssueRow key={issue.id} issue={issue} openIssueModal={openIssueModal} />
              ))}
            </div>
          )}

          {/* Your requests — human asking agents */}
          {fromHuman.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ArrowUp className="w-3 h-3 text-blue-500" />
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Your Requests</span>
              </div>
              {fromHuman.map(issue => (
                <IssueRow key={issue.id} issue={issue} openIssueModal={openIssueModal} />
              ))}
            </div>
          )}

          {openIssues.length === 0 && (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 text-center py-4">
              No open human intervention issues
            </p>
          )}

          {/* Closed issues — collapsed */}
          {closedIssues.length > 0 && (
            <details className="text-xs">
              <summary className="text-neutral-400 dark:text-neutral-500 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300">
                {closedIssues.length} resolved
              </summary>
              <div className="mt-1 space-y-1">
                {closedIssues.slice(0, 5).map(issue => (
                  <IssueRow key={issue.id} issue={issue} openIssueModal={openIssueModal} />
                ))}
                {closedIssues.length > 5 && (
                  <p className="text-neutral-400 text-[10px]">...and {closedIssues.length - 5} more</p>
                )}
              </div>
            </details>
          )}
        </div>

        {isWriteMode && (
          <>
            <Separator className="my-2 shrink-0" />
            <Button
              onClick={() => setCreateIssueModal({ open: true, title: '', body: '', creating: false, error: null })}
              size="sm"
              className="w-full dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-100"
            >
              New Intervention
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function IssueRow({ issue, openIssueModal }) {
  return (
    <div
      onClick={() => openIssueModal(issue.id)}
      className="block p-2 bg-neutral-50 dark:bg-neutral-900 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors mb-1"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-400 dark:text-neutral-500">#{issue.id}</span>
        <Badge
          variant={issue.status === 'open' ? 'success' : 'secondary'}
          className="text-[10px] px-1.5 py-0"
        >
          {issue.status || 'open'}
        </Badge>
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{issue.title}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        {issue.creator && (
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />{issue.creator}
          </span>
        )}
        {issue.assignee && (
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <UserCheck className="w-3 h-3" />{issue.assignee}
          </span>
        )}
        {issue.comment_count > 0 && (
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />{issue.comment_count}
          </span>
        )}
      </div>
    </div>
  )
}
