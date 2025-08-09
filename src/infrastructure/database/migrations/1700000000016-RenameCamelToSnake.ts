import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCamelToSnake1700000000016 implements MigrationInterface {
  name = 'RenameCamelToSnake1700000000016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // jobs table
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='jobNumber') THEN
        ALTER TABLE jobs RENAME COLUMN "jobNumber" TO job_number;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='experienceLevel') THEN
        ALTER TABLE jobs RENAME COLUMN "experienceLevel" TO experience_level;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='managementLevel') THEN
        ALTER TABLE jobs RENAME COLUMN "managementLevel" TO management_level;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='jobType') THEN
        ALTER TABLE jobs RENAME COLUMN "jobType" TO job_type;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='minimumQualifications') THEN
        ALTER TABLE jobs RENAME COLUMN "minimumQualifications" TO minimum_qualifications;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='preferredRequirement') THEN
        ALTER TABLE jobs RENAME COLUMN "preferredRequirement" TO preferred_requirement;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='directManager') THEN
        ALTER TABLE jobs RENAME COLUMN "directManager" TO direct_manager;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='directManagerTitle') THEN
        ALTER TABLE jobs RENAME COLUMN "directManagerTitle" TO direct_manager_title;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='directManagerProfile') THEN
        ALTER TABLE jobs RENAME COLUMN "directManagerProfile" TO direct_manager_profile;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='directManagerLogo') THEN
        ALTER TABLE jobs RENAME COLUMN "directManagerLogo" TO direct_manager_logo;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='locationType') THEN
        ALTER TABLE jobs RENAME COLUMN "locationType" TO location_type;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='locationValue') THEN
        ALTER TABLE jobs RENAME COLUMN "locationValue" TO location_value;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salaryFromCents') THEN
        ALTER TABLE jobs RENAME COLUMN "salaryFromCents" TO salary_from_cents;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salaryFromCurrency') THEN
        ALTER TABLE jobs RENAME COLUMN "salaryFromCurrency" TO salary_from_currency;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salaryToCents') THEN
        ALTER TABLE jobs RENAME COLUMN "salaryToCents" TO salary_to_cents;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salaryToCurrency') THEN
        ALTER TABLE jobs RENAME COLUMN "salaryToCurrency" TO salary_to_currency;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salaryType') THEN
        ALTER TABLE jobs RENAME COLUMN "salaryType" TO salary_type;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referralCents') THEN
        ALTER TABLE jobs RENAME COLUMN "referralCents" TO referral_cents;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referralCurrency') THEN
        ALTER TABLE jobs RENAME COLUMN "referralCurrency" TO referral_currency;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referralType') THEN
        ALTER TABLE jobs RENAME COLUMN "referralType" TO referral_type;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referralInfo') THEN
        ALTER TABLE jobs RENAME COLUMN "referralInfo" TO referral_info;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='applyMethod') THEN
        ALTER TABLE jobs RENAME COLUMN "applyMethod" TO apply_method;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='applyTarget') THEN
        ALTER TABLE jobs RENAME COLUMN "applyTarget" TO apply_target;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='englishLevel') THEN
        ALTER TABLE jobs RENAME COLUMN "englishLevel" TO english_level;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='postedDate') THEN
        ALTER TABLE jobs RENAME COLUMN "postedDate" TO posted_date;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='expiredDate') THEN
        ALTER TABLE jobs RENAME COLUMN "expiredDate" TO expired_date;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='addressToken') THEN
        ALTER TABLE jobs RENAME COLUMN "addressToken" TO address_token;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='chainId') THEN
        ALTER TABLE jobs RENAME COLUMN "chainId" TO chain_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='createdBy') THEN
        ALTER TABLE jobs RENAME COLUMN "createdBy" TO created_by;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='updatedBy') THEN
        ALTER TABLE jobs RENAME COLUMN "updatedBy" TO updated_by;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='organizationId') THEN
        ALTER TABLE jobs RENAME COLUMN "organizationId" TO organization_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='specialityId') THEN
        ALTER TABLE jobs RENAME COLUMN "specialityId" TO speciality_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='cityId') THEN
        ALTER TABLE jobs RENAME COLUMN "cityId" TO city_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='countryId') THEN
        ALTER TABLE jobs RENAME COLUMN "countryId" TO country_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='regionId') THEN
        ALTER TABLE jobs RENAME COLUMN "regionId" TO region_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='globalRegionId') THEN
        ALTER TABLE jobs RENAME COLUMN "globalRegionId" TO global_region_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='partnerHostId') THEN
        ALTER TABLE jobs RENAME COLUMN "partnerHostId" TO partner_host_id;
      END IF;
    END $$;`);

    // job_applies
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='jobId') THEN
        ALTER TABLE job_applies RENAME COLUMN "jobId" TO job_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='talentId') THEN
        ALTER TABLE job_applies RENAME COLUMN "talentId" TO talent_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='uploadedResumeId') THEN
        ALTER TABLE job_applies RENAME COLUMN "uploadedResumeId" TO uploaded_resume_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='jobReferralId') THEN
        ALTER TABLE job_applies RENAME COLUMN "jobReferralId" TO job_referral_id;
      END IF;
    END $$;`);

    // job_referrals
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_referrals' AND column_name='jobId') THEN
        ALTER TABLE job_referrals RENAME COLUMN "jobId" TO job_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_referrals' AND column_name='referrerId') THEN
        ALTER TABLE job_referrals RENAME COLUMN "referrerId" TO referrer_id;
      END IF;
    END $$;`);

    // referral_links
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='referral_links' AND column_name='jobId') THEN
        ALTER TABLE referral_links RENAME COLUMN "jobId" TO job_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='referral_links' AND column_name='referrerId') THEN
        ALTER TABLE referral_links RENAME COLUMN "referrerId" TO referrer_id;
      END IF;
    END $$;`);

    // job_choice_options
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_choice_options' AND column_name='jobId') THEN
        ALTER TABLE job_choice_options RENAME COLUMN "jobId" TO job_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_choice_options' AND column_name='choiceOptionId') THEN
        ALTER TABLE job_choice_options RENAME COLUMN "choiceOptionId" TO choice_option_id;
      END IF;
    END $$;`);

    // job_skills
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_skills' AND column_name='jobId') THEN
        ALTER TABLE job_skills RENAME COLUMN "jobId" TO job_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_skills' AND column_name='skillId') THEN
        ALTER TABLE job_skills RENAME COLUMN "skillId" TO skill_id;
      END IF;
    END $$;`);

    // web3_events (job domain variant)
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='jobId') THEN
        ALTER TABLE web3_events RENAME COLUMN "jobId" TO job_id;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='eventType') THEN
        ALTER TABLE web3_events RENAME COLUMN "eventType" TO event_type;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='eventData') THEN
        ALTER TABLE web3_events RENAME COLUMN "eventData" TO event_data;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='transactionHash') THEN
        ALTER TABLE web3_events RENAME COLUMN "transactionHash" TO transaction_hash;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='blockNumber') THEN
        ALTER TABLE web3_events RENAME COLUMN "blockNumber" TO block_number;
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='chainId') THEN
        ALTER TABLE web3_events RENAME COLUMN "chainId" TO chain_id;
      END IF;
    END $$;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse renames (best effort)
    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='job_number') THEN
        ALTER TABLE jobs RENAME COLUMN job_number TO "jobNumber";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='experience_level') THEN
        ALTER TABLE jobs RENAME COLUMN experience_level TO "experienceLevel";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='management_level') THEN
        ALTER TABLE jobs RENAME COLUMN management_level TO "managementLevel";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='job_type') THEN
        ALTER TABLE jobs RENAME COLUMN job_type TO "jobType";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='minimum_qualifications') THEN
        ALTER TABLE jobs RENAME COLUMN minimum_qualifications TO "minimumQualifications";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='preferred_requirement') THEN
        ALTER TABLE jobs RENAME COLUMN preferred_requirement TO "preferredRequirement";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='direct_manager') THEN
        ALTER TABLE jobs RENAME COLUMN direct_manager TO "directManager";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='direct_manager_title') THEN
        ALTER TABLE jobs RENAME COLUMN direct_manager_title TO "directManagerTitle";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='direct_manager_profile') THEN
        ALTER TABLE jobs RENAME COLUMN direct_manager_profile TO "directManagerProfile";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='direct_manager_logo') THEN
        ALTER TABLE jobs RENAME COLUMN direct_manager_logo TO "directManagerLogo";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='location_type') THEN
        ALTER TABLE jobs RENAME COLUMN location_type TO "locationType";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='location_value') THEN
        ALTER TABLE jobs RENAME COLUMN location_value TO "locationValue";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_from_cents') THEN
        ALTER TABLE jobs RENAME COLUMN salary_from_cents TO "salaryFromCents";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_from_currency') THEN
        ALTER TABLE jobs RENAME COLUMN salary_from_currency TO "salaryFromCurrency";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_to_cents') THEN
        ALTER TABLE jobs RENAME COLUMN salary_to_cents TO "salaryToCents";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_to_currency') THEN
        ALTER TABLE jobs RENAME COLUMN salary_to_currency TO "salaryToCurrency";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='salary_type') THEN
        ALTER TABLE jobs RENAME COLUMN salary_type TO "salaryType";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referral_cents') THEN
        ALTER TABLE jobs RENAME COLUMN referral_cents TO "referralCents";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referral_currency') THEN
        ALTER TABLE jobs RENAME COLUMN referral_currency TO "referralCurrency";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referral_type') THEN
        ALTER TABLE jobs RENAME COLUMN referral_type TO "referralType";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='referral_info') THEN
        ALTER TABLE jobs RENAME COLUMN referral_info TO "referralInfo";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='apply_method') THEN
        ALTER TABLE jobs RENAME COLUMN apply_method TO "applyMethod";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='apply_target') THEN
        ALTER TABLE jobs RENAME COLUMN apply_target TO "applyTarget";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='english_level') THEN
        ALTER TABLE jobs RENAME COLUMN english_level TO "englishLevel";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='posted_date') THEN
        ALTER TABLE jobs RENAME COLUMN posted_date TO "postedDate";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='expired_date') THEN
        ALTER TABLE jobs RENAME COLUMN expired_date TO "expiredDate";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='address_token') THEN
        ALTER TABLE jobs RENAME COLUMN address_token TO "addressToken";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='chain_id') THEN
        ALTER TABLE jobs RENAME COLUMN chain_id TO "chainId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='created_by') THEN
        ALTER TABLE jobs RENAME COLUMN created_by TO "createdBy";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='updated_by') THEN
        ALTER TABLE jobs RENAME COLUMN updated_by TO "updatedBy";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='organization_id') THEN
        ALTER TABLE jobs RENAME COLUMN organization_id TO "organizationId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='speciality_id') THEN
        ALTER TABLE jobs RENAME COLUMN speciality_id TO "specialityId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='city_id') THEN
        ALTER TABLE jobs RENAME COLUMN city_id TO "cityId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='country_id') THEN
        ALTER TABLE jobs RENAME COLUMN country_id TO "countryId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='region_id') THEN
        ALTER TABLE jobs RENAME COLUMN region_id TO "regionId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='global_region_id') THEN
        ALTER TABLE jobs RENAME COLUMN global_region_id TO "globalRegionId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='partner_host_id') THEN
        ALTER TABLE jobs RENAME COLUMN partner_host_id TO "partnerHostId";
      END IF;
    END $$;`);

    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='job_id') THEN
        ALTER TABLE job_applies RENAME COLUMN job_id TO "jobId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='talent_id') THEN
        ALTER TABLE job_applies RENAME COLUMN talent_id TO "talentId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='uploaded_resume_id') THEN
        ALTER TABLE job_applies RENAME COLUMN uploaded_resume_id TO "uploadedResumeId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_applies' AND column_name='job_referral_id') THEN
        ALTER TABLE job_applies RENAME COLUMN job_referral_id TO "jobReferralId";
      END IF;
    END $$;`);

    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_referrals' AND column_name='job_id') THEN
        ALTER TABLE job_referrals RENAME COLUMN job_id TO "jobId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_referrals' AND column_name='referrer_id') THEN
        ALTER TABLE job_referrals RENAME COLUMN referrer_id TO "referrerId";
      END IF;
    END $$;`);

    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='referral_links' AND column_name='job_id') THEN
        ALTER TABLE referral_links RENAME COLUMN job_id TO "jobId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='referral_links' AND column_name='referrer_id') THEN
        ALTER TABLE referral_links RENAME COLUMN referrer_id TO "referrerId";
      END IF;
    END $$;`);

    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_choice_options' AND column_name='job_id') THEN
        ALTER TABLE job_choice_options RENAME COLUMN job_id TO "jobId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_choice_options' AND column_name='choice_option_id') THEN
        ALTER TABLE job_choice_options RENAME COLUMN choice_option_id TO "choiceOptionId";
      END IF;
    END $$;`);

    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_skills' AND column_name='job_id') THEN
        ALTER TABLE job_skills RENAME COLUMN job_id TO "jobId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='job_skills' AND column_name='skill_id') THEN
        ALTER TABLE job_skills RENAME COLUMN skill_id TO "skillId";
      END IF;
    END $$;`);

    await queryRunner.query(`DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='job_id') THEN
        ALTER TABLE web3_events RENAME COLUMN job_id TO "jobId";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='event_type') THEN
        ALTER TABLE web3_events RENAME COLUMN event_type TO "eventType";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='event_data') THEN
        ALTER TABLE web3_events RENAME COLUMN event_data TO "eventData";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='transaction_hash') THEN
        ALTER TABLE web3_events RENAME COLUMN transaction_hash TO "transactionHash";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='block_number') THEN
        ALTER TABLE web3_events RENAME COLUMN block_number TO "blockNumber";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='web3_events' AND column_name='chain_id') THEN
        ALTER TABLE web3_events RENAME COLUMN chain_id TO "chainId";
      END IF;
    END $$;`);
  }
}
