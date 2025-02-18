import { mergeMap, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { CommunityDetailsService } from '../core/services/community-details.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Community } from '../core/shared/community.model';

import { MetadataService } from '../core/metadata/metadata.service';

import { fadeInOut } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';
import { redirectToPageNotFoundOn404 } from '../core/shared/operators';

@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent implements OnInit {
	
	@ViewChild('check') check: ElementRef;
  /**
   * The community displayed on this page
   */
  communityRD$: Observable<RemoteData<Community>>;

  /**
   * The logo of this community
   */
  logoRD$: Observable<RemoteData<Bitstream>>;
  message:string;
  constructor(
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private data:CommunityDetailsService
  ) {

  }

  ngOnInit(): void {
  	this.data.currentMessage.subscribe((message) => this.message = message);
    this.communityRD$ = this.route.data.pipe(
      map((data) => data.community as RemoteData<Community>),
      redirectToPageNotFoundOn404(this.router)
    );
    this.logoRD$ = this.communityRD$.pipe(
      map((rd: RemoteData<Community>) => rd.payload),
      filter((community: Community) => hasValue(community)),
      mergeMap((community: Community) => community.logo));
  }

}
